import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { updateUserRanking } from '@/hooks/useUserRanking'

export const createApprovalSlice = (set, get) => ({
  approvePendingPurchase: async (raffleId, purchase) => {
    try {
      const docRef = doc(db, 'raffles', raffleId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error('Rifa no encontrada')
      }

      const currentRaffle = docSnap.data()

      let selectedTickets = [...purchase.selectedTickets]

      // Remover la compra de pendingPurchases
      const updatedPendingPurchases = currentRaffle.pendingPurchases.filter(
        p => p.createdAt.seconds !== purchase.createdAt.seconds
      )

      // Agregar tickets a soldTickets
      const updatedSoldTickets = [
        ...(currentRaffle.soldTickets || []),
        ...selectedTickets
      ]

      // Validación de asignación correcta de tickets
      const ticketsValidation = selectedTickets.every(ticket => {
        // Verificar que el ticket esté en soldTickets
        const isInSoldTickets = updatedSoldTickets.includes(ticket)
        // Verificar que el ticket no esté duplicado en soldTickets
        const occurrences = updatedSoldTickets.filter(t => t === ticket).length
        return isInSoldTickets && occurrences === 1
      })

      if (!ticketsValidation) {
        throw new Error('Error en la asignación de tickets: Posible duplicado o ticket no asignado correctamente')
      }

      // Manejar tickets reservados según el tipo de rifa
      let updatedReservedTickets = [...(currentRaffle.reservedTickets || [])]

      if (currentRaffle.randomTickets) {
        // Para rifas aleatorias, eliminar la cantidad de tickets que se vendieron
        const ticketsToRemove = selectedTickets.length
        updatedReservedTickets = updatedReservedTickets.slice(ticketsToRemove)
      } else {
        // Para rifas normales, eliminar los tickets específicos
        updatedReservedTickets = updatedReservedTickets.filter(
          ticket => !selectedTickets.includes(ticket)
        )
      }

      // Agregar usuario a la lista de usuarios confirmados
      const updatedUsers = [
        ...(currentRaffle.users || []),
        {
          ...purchase,
          status: 'confirmed',
          purchaseDate: new Date()
        }
      ]

      const updatedRaffle = {
        ...currentRaffle,
        pendingPurchases: updatedPendingPurchases,
        soldTickets: updatedSoldTickets,
        reservedTickets: updatedReservedTickets,
        users: updatedUsers,
        availableNumbers: currentRaffle.totalTickets - updatedSoldTickets.length - updatedReservedTickets.length
      }

      // Validación de asignación de tickets al usuario
      const userTicketsValidation = updatedUsers.find(user => 
        user.email === purchase.email && 
        user.createdAt.seconds === purchase.createdAt.seconds
      )

      if (!userTicketsValidation) {
        throw new Error('Error: Usuario no encontrado en la lista de usuarios confirmados')
      }

      const userTicketsMatch = JSON.stringify(userTicketsValidation.selectedTickets.sort()) === 
                              JSON.stringify(selectedTickets.sort())

      if (!userTicketsMatch) {
        throw new Error('Error: Los tickets asignados al usuario no coinciden con los tickets seleccionados')
      }

      await updateDoc(docRef, updatedRaffle)

      // Actualizar el ranking de usuarios - Agregar console.log para debug
      console.log('Actualizando ranking para:', {
        name: purchase.name,
        email: purchase.email,
        phone: purchase.phone,
        selectedTickets: selectedTickets
      })

      // Obtener la función del store
      const { updateUserRanking } = get()
      
      // Asegurarse de que la función existe
      if (!updateUserRanking) {
        console.error('updateUserRanking no está disponible en el store')
        return
      }

      // Llamar a la función de actualización del ranking
      await updateUserRanking({
        name: purchase.name,
        email: purchase.email,
        phone: purchase.phone,
        selectedTickets: selectedTickets
      })

      // Enviar correo de confirmación usando Resend API
      const emailParams = {
        email: purchase.email,
        name: purchase.name,
        amount: (selectedTickets.length * currentRaffle.price).toFixed(2),
        date: new Date(purchase.createdAt.seconds * 1000).toLocaleDateString(),
        paymentMethod: purchase.paymentMethod,
        raffleName: currentRaffle.title,
        ticketsCount: selectedTickets.length,
        confirmationNumber: purchase.reference,
        number: selectedTickets.join(', ')
      }

      const emailResponse = await fetch('/api/email/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailParams)
      })

      if (!emailResponse.ok) {
        console.error('Error al enviar el correo de confirmación')
      }

      set(state => ({
        raffles: state.raffles.map(raffle =>
          raffle.id === raffleId ? { ...raffle, ...updatedRaffle } : raffle
        )
      }))

      return true
    } catch (error) {
      console.error('Error en approvePendingPurchase:', error)
      throw error
    }
  },

  rejectPendingPurchase: async (raffleId, purchase) => {
    try {
      const docRef = doc(db, 'raffles', raffleId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error('Rifa no encontrada')
      }

      const currentRaffle = docSnap.data()

      // Remover la compra de pendingPurchases
      const updatedPendingPurchases = currentRaffle.pendingPurchases.filter(
        p => p.createdAt.seconds !== purchase.createdAt.seconds
      )

      // Remover tickets de reservedTickets
      const updatedReservedTickets = currentRaffle.reservedTickets.filter(
        ticket => !purchase.selectedTickets.includes(ticket)
      )

      const updatedRaffle = {
        ...currentRaffle,
        pendingPurchases: updatedPendingPurchases,
        reservedTickets: updatedReservedTickets,
        availableNumbers: currentRaffle.totalTickets -
          (currentRaffle.soldTickets?.length || 0) -
          updatedReservedTickets.length
      }

      await updateDoc(docRef, updatedRaffle)

      set(state => ({
        raffles: state.raffles.map(raffle =>
          raffle.id === raffleId ? { ...raffle, ...updatedRaffle } : raffle
        )
      }))

      return true
    } catch (error) {
      console.error('Error rejecting purchase:', error)
      throw error
    }
  }
}) 