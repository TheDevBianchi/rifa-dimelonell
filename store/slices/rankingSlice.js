import { collection, query, where, getDocs, updateDoc, addDoc, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export const createRankingSlice = (set, get) => ({
  updateUserRanking: async (userData) => {
    try {
      console.log('Iniciando actualización de ranking para:', userData)
      const { name, email, phone, selectedTickets } = userData
      
      if (!email || !phone || !selectedTickets) {
        throw new Error('Datos de usuario incompletos')
      }

      const rankingRef = collection(db, 'userRanking')
      
      // Buscar si existe un usuario con el mismo email y teléfono
      const q = query(
        rankingRef,
        where('email', '==', email),
        where('phone', '==', phone)
      )
      
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        console.log('Usuario existente encontrado')
        // Usuario existente - actualizar tickets
        const userDoc = querySnapshot.docs[0]
        const currentData = userDoc.data()
        const currentTickets = currentData.totalTickets || 0
        
        await updateDoc(doc(db, 'userRanking', userDoc.id), {
          totalTickets: currentTickets + selectedTickets.length,
          lastPurchase: new Date(),
          purchases: [
            ...(currentData.purchases || []),
            {
              tickets: selectedTickets.length,
              date: new Date()
            }
          ]
        })
      } else {
        console.log('Creando nuevo usuario en ranking')
        // Nuevo usuario - crear registro
        const newUserData = {
          name,
          email,
          phone,
          totalTickets: selectedTickets.length,
          firstPurchase: new Date(),
          lastPurchase: new Date(),
          purchases: [{
            tickets: selectedTickets.length,
            date: new Date()
          }]
        }

        await addDoc(rankingRef, newUserData)
      }
      
      console.log('Ranking actualizado exitosamente')
      return true
    } catch (error) {
      console.error('Error updating user ranking:', error)
      throw error
    }
  },

  resetUserRanking: async () => {
    try {
      const rankingRef = collection(db, 'userRanking')
      const querySnapshot = await getDocs(rankingRef)
      
      // Eliminar todos los documentos en la colección
      const deletePromises = querySnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      )
      
      await Promise.all(deletePromises)
      
      console.log('Ranking reiniciado exitosamente')
      return true
    } catch (error) {
      console.error('Error resetting user ranking:', error)
      throw error
    }
  },

  getRankingByRaffle: async (raffleId) => {
    try {
      if (raffleId === 'all') {
        // Obtener ranking general
        const rankingRef = collection(db, 'userRanking')
        const querySnapshot = await getDocs(rankingRef)
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastPurchase: doc.data().lastPurchase?.toDate(),
          selectedTickets: doc.data().selectedTickets || [],
          raffleName: 'Todas'
        }))
      }

      // Obtener ranking específico de una rifa
      const raffleRef = doc(db, 'raffles', raffleId)
      const raffleSnap = await getDoc(raffleRef)
      
      if (!raffleSnap.exists()) {
        throw new Error('Rifa no encontrada')
      }

      const raffleData = raffleSnap.data()
      const confirmedUsers = raffleData.users?.filter(user => user.status === 'confirmed') || []

      // Agrupar por usuario
      const userMap = confirmedUsers.reduce((acc, user) => {
        const userEmail = user.email;
        
        if (!acc[userEmail]) {
          acc[userEmail] = {
            name: user.name,
            email: userEmail,
            phone: user.phone,
            selectedTickets: user.selectedTickets || [],
            totalTickets: user.selectedTickets?.length || 0,
            lastPurchase: user.purchaseDate,
            raffleName: raffleData.title
          }
        } else {
          // Actualizar el total de tickets sumando los nuevos
          acc[userEmail].totalTickets += user.selectedTickets?.length || 0;
          // Actualizar la fecha de última compra si es más reciente
          if (user.purchaseDate > acc[userEmail].lastPurchase) {
            acc[userEmail].lastPurchase = user.purchaseDate;
          }
        }
        
        return acc;
      }, {})

      return Object.values(userMap)
    } catch (error) {
      console.error('Error getting raffle ranking:', error)
      throw error
    }
  }
}) 