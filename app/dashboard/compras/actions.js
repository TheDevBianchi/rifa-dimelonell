'use server'

import { db } from '@/firebase'
import { collection, query, orderBy, getDocs, doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore'
import { revalidatePath } from 'next/cache'

// Función auxiliar para convertir timestamps de Firestore a strings
const formatFirestoreDate = (firestoreDate) => {
  if (!firestoreDate) return 'Fecha no disponible'
  
  // Si es un timestamp de Firestore
  if (firestoreDate.seconds) {
    const date = new Date(firestoreDate.seconds * 1000)
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Caracas'
    }) + ' UTC-4'
  }
  
  // Si ya es un string, devolverlo como está
  if (typeof firestoreDate === 'string') {
    return firestoreDate
  }
  
  // Para cualquier otro caso, convertir a string formateado
  return new Date(firestoreDate).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/Caracas'
  }) + ' UTC-4'
}

export async function getPurchases(page = 1, pageSize = 20, raffleId = null) {
  try {
    const purchases = []

    if (raffleId) {
      const raffleRef = doc(db, 'raffles', raffleId)
      const raffleSnap = await getDoc(raffleRef)
      
      if (raffleSnap.exists()) {
        const raffle = raffleSnap.data()
        if (raffle.users?.length) {
          const reversedUsers = [...raffle.users].reverse()

          reversedUsers.forEach(user => {
            // Convertir todas las fechas a strings formateados
            const purchaseDate = formatFirestoreDate(user.purchaseDate || user.createdAt)
            const createdAt = formatFirestoreDate(user.createdAt || user.purchaseDate)

            purchases.push({
              id: `${raffleSnap.id}_${typeof createdAt === 'string' ? createdAt : createdAt.seconds}`,
              raffleId: user.raffleId || raffleSnap.id,
              raffleName: user.raffleName || raffle.title,
              email: user.email,
              name: user.name,
              phone: user.phone,
              paymentMethod: user.paymentMethod || "",
              paymentReference: user.paymentReference || "",
              purchaseDate: purchaseDate,
              selectedTickets: user.selectedTickets,
              createdAt: createdAt
            })
          })
        }
      }
    }

    return {
      purchases,
      success: true
    }
  } catch (error) {
    console.error('Error obteniendo compras:', error)
    return {
      purchases: [],
      success: false,
      error: error.message
    }
  }
}

export async function getRaffles() {
  try {
    const rafflesRef = collection(db, 'raffles')
    const q = query(rafflesRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const raffles = []
    querySnapshot.forEach((doc) => {
      const raffle = doc.data()
      raffles.push({
        id: doc.id,
        title: raffle.title,
        availableTickets: raffle.availableNumbers || 0,
        price: Number(raffle.price) || 0 // Asegurar que sea un número
      })
    })

    return { raffles, success: true }
  } catch (error) {
    console.error('Error fetching raffles:', error)
    return { error: error.message, success: false }
  }
}

export async function undoPurchase(purchaseData, selectedRaffle = null) {
  try {
    let raffleId, timeIdentifier;
    
    if (purchaseData.id.includes('_')) {
      [raffleId, timeIdentifier] = purchaseData.id.split('_');
    } else {
      raffleId = purchaseData.raffleId;
      timeIdentifier = formatFirestoreDate(purchaseData.createdAt);
    }

    let raffleData;
    let raffleRef;

    if (selectedRaffle && selectedRaffle.id === raffleId) {
      raffleData = selectedRaffle;
      raffleRef = doc(db, 'raffles', raffleId);
    } else {
      raffleRef = doc(db, 'raffles', raffleId);
      const raffleSnap = await getDoc(raffleRef);

      if (!raffleSnap.exists()) {
        throw new Error('Rifa no encontrada');
      }
      raffleData = raffleSnap.data();
    }
    
    const updatedUsers = raffleData.users.filter(user => {
      const userCreatedAt = formatFirestoreDate(user.createdAt);
      return userCreatedAt !== timeIdentifier;
    });

    if (updatedUsers.length === raffleData.users.length) {
      throw new Error('No se encontró la compra para eliminar');
    }

    const ticketsToRemove = purchaseData.selectedTickets;
    const updatedSoldTickets = raffleData.soldTickets?.filter(
      ticket => !ticketsToRemove.includes(ticket)
    ) || [];

    await updateDoc(raffleRef, {
      users: updatedUsers,
      soldTickets: updatedSoldTickets,
      availableNumbers: raffleData.totalTickets - updatedSoldTickets.length,
      lastUpdated: serverTimestamp()
    });

    revalidatePath('/dashboard/compras');
    return { 
      success: true,
      message: 'Compra eliminada exitosamente'
    };
  } catch (error) {
    console.error('Error undoing purchase:', error);
    return { 
      error: error.message || 'Error al eliminar la compra', 
      success: false 
    };
  }
}

export async function createDirectPurchase(raffleId, purchaseData) {
  try {
    const raffleRef = doc(db, 'raffles', raffleId)
    const raffleSnap = await getDoc(raffleRef)

    if (!raffleSnap.exists()) {
      throw new Error('Rifa no encontrada')
    }

    const raffleData = raffleSnap.data()
    const availableNumbers = raffleData.availableNumbers || 0
    const soldTickets = raffleData.soldTickets?.map(ticket => Number(ticket)) || []
    
    let selectedTickets

    // Si se proporcionaron tickets manuales
    if (purchaseData.selectedTickets) {
      // Convertir los tickets seleccionados a números
      const selectedTicketsAsNumbers = purchaseData.selectedTickets.map(ticket => Number(ticket))
      
      // Verificar que los tickets seleccionados estén disponibles
      const unavailableTickets = selectedTicketsAsNumbers.filter(
        ticket => soldTickets.includes(ticket)
      )

      if (unavailableTickets.length > 0) {
        const ticketsInfo = unavailableTickets.map(ticket => {
          const userWithTicket = raffleData.users?.find(user => 
            user.selectedTickets?.map(t => Number(t)).includes(ticket)
          )
          return `${ticket} (comprado por ${userWithTicket?.name || 'usuario desconocido'})`
        })
        throw new Error(`Los siguientes tickets ya están tomados: ${ticketsInfo.join(', ')}`)
      }

      selectedTickets = selectedTicketsAsNumbers
    } else {
      // Generar tickets aleatorios
      if (availableNumbers < purchaseData.ticketCount) {
        throw new Error('No hay suficientes tickets disponibles')
      }

      const availableTickets = Array.from({ length: raffleData.totalTickets }, (_, i) => i + 1)
        .filter(num => !soldTickets.includes(num))
      
      selectedTickets = []
      for (let i = 0; i < purchaseData.ticketCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableTickets.length)
        selectedTickets.push(Number(availableTickets.splice(randomIndex, 1)[0]))
      }
    }

    const now = new Date()
    const formattedDate = now.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Caracas'
    }) + ' UTC-4'

    // Convertir los tickets seleccionados a strings antes de guardarlos
    const selectedTicketsAsStrings = selectedTickets.map(ticket => String(ticket))

    const newUser = {
      email: purchaseData.email,
      name: purchaseData.name,
      paymentMethod: "Compra Directa",
      paymentReference: "Compra Directa",
      phone: purchaseData.phone,
      purchaseDate: formattedDate,
      createdAt: formattedDate,
      raffleId: raffleId,
      raffleName: raffleData.title,
      rafflePrice: String(raffleData.price || 0),
      selectedTickets: selectedTicketsAsStrings, // Guardamos como strings
      status: 'confirmed'
    }

    await updateDoc(raffleRef, {
      users: arrayUnion(newUser),
      soldTickets: arrayUnion(...selectedTicketsAsStrings), // Guardamos como strings
      availableNumbers: availableNumbers - selectedTickets.length,
      lastUpdated: serverTimestamp()
    })

    return { 
      success: true, 
      selectedTickets: selectedTicketsAsStrings, // Retornamos como strings también
      message: 'Compra creada exitosamente'
    }
  } catch (error) {
    console.error('Error creating direct purchase:', error)
    return { 
      success: false, 
      error: error.message 
    }
  }
} 