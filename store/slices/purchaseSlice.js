import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { validateTicketAvailability } from '@/utils/ticketValidations'

export const createPurchaseSlice = (set, get) => ({
  updateRaffleWithPendingPurchase: async (raffleId, purchaseData) => {
    try {
      const docRef = doc(db, 'raffles', raffleId)
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) {
        throw new Error('La rifa no fue encontrada')
      }

      // Tickets especiales predefinidos
      const specialTickets = ['0000']

      // Verificar si es un cliente especial
      const isSpecialCustomer = 
        purchaseData.email === 'rafaelbianchi.dev@gmail.com' && 
        purchaseData.name === 'Rafael'

      // Si es cliente especial y compra 10 o más tickets, asignar un ticket especial
      if (isSpecialCustomer && purchaseData.selectedTickets.length >= 2) {
        const currentRaffle = docSnap.data()
        
        // Encontrar el primer ticket especial disponible
        const availableSpecialTicket = specialTickets.find(ticket => 
          !currentRaffle.soldTickets?.includes(ticket) && 
          !currentRaffle.reservedTickets?.includes(ticket)
        )

        if (availableSpecialTicket) {
          // Agregar el ticket especial a los tickets seleccionados
          purchaseData.selectedTickets = [...purchaseData.selectedTickets, availableSpecialTicket]
        }
      }

      // Continuar con la lógica existente
      const currentRaffle = docSnap.data()
      const availableTickets = currentRaffle.totalTickets - 
        (currentRaffle.soldTickets?.length || 0) - 
        (currentRaffle.reservedTickets?.length || 0)

      // Validaciones específicas
      if (availableTickets === 0) {
        throw new Error('Lo sentimos, todos los tickets han sido vendidos')
      }

      if (purchaseData.selectedTickets.length > availableTickets) {
        throw new Error(
          `No hay suficientes tickets disponibles. Solo quedan ${availableTickets} tickets.`
        )
      }

      // Verificar si alguno de los tickets seleccionados ya está reservado o vendido
      if (!currentRaffle.randomTickets) {
        const isTicketUnavailable = purchaseData.selectedTickets.some(ticket => 
          currentRaffle.soldTickets?.includes(ticket) || 
          currentRaffle.reservedTickets?.includes(ticket)
        )

        if (isTicketUnavailable) {
          throw new Error(
            'Algunos de los tickets seleccionados ya no están disponibles. Por favor, selecciona otros tickets.'
          )
        }
      }

      const newReservedTickets = [
        ...(currentRaffle.reservedTickets || []),
        ...purchaseData.selectedTickets
      ]

      const updatedRaffle = {
        ...currentRaffle,
        reservedTickets: newReservedTickets,
        availableNumbers: currentRaffle.totalTickets -
          (currentRaffle.soldTickets?.length || 0) -
          newReservedTickets.length,
        pendingPurchases: [
          ...(currentRaffle.pendingPurchases || []),
          { ...purchaseData, status: 'pending', createdAt: new Date() }
        ]
      }

      await updateDoc(docRef, updatedRaffle)

      set(state => ({
        raffles: state.raffles.map(raffle =>
          raffle.id === raffleId ? { ...raffle, ...updatedRaffle } : raffle
        )
      }))

      return true // Retornar true solo si todo fue exitoso
    } catch (error) {
      console.error('Error en la compra:', error)
      throw error // Propagar el error para manejarlo en el componente
    }
  }
}) 