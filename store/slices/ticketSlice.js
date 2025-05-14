import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export const createTicketSlice = (set, get) => ({
  reserveTickets: async (raffleId, selectedTickets) => {
    try {
      const docRef = doc(db, 'raffles', raffleId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error('Rifa no encontrada')
      }

      const currentRaffle = docSnap.data()
      const currentReservedTickets = currentRaffle.reservedTickets || []
      const currentSoldTickets = currentRaffle.soldTickets || []

      // Verificar si algún ticket ya está vendido o reservado
      const unavailableTickets = [...currentReservedTickets, ...currentSoldTickets]
      const conflictingTickets = selectedTickets.filter(ticket =>
        unavailableTickets.includes(ticket)
      )

      if (conflictingTickets.length > 0) {
        throw new Error(`Los tickets ${conflictingTickets.join(', ')} no están disponibles`)
      }

      // Actualizar tickets reservados
      const updatedRaffle = {
        ...currentRaffle,
        reservedTickets: [...currentReservedTickets, ...selectedTickets],
        availableNumbers: currentRaffle.totalTickets -
          currentSoldTickets.length -
          (currentReservedTickets.length + selectedTickets.length)
      }

      await updateDoc(docRef, updatedRaffle)

      // Actualizar el estado local
      set(state => ({
        raffles: state.raffles.map(raffle =>
          raffle.id === raffleId ? { ...raffle, ...updatedRaffle } : raffle
        )
      }))

      return true
    } catch (error) {
      console.error('Error reserving tickets:', error)
      throw error
    }
  },

  unreserveTickets: async (raffleId, ticketsToUnreserve) => {
    try {
      const docRef = doc(db, 'raffles', raffleId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error('Rifa no encontrada')
      }

      const currentRaffle = docSnap.data()
      const currentReservedTickets = currentRaffle.reservedTickets || []

      // Remover tickets de la reserva
      const updatedReservedTickets = currentReservedTickets.filter(
        ticket => !ticketsToUnreserve.includes(ticket)
      )

      const updatedRaffle = {
        ...currentRaffle,
        reservedTickets: updatedReservedTickets,
        availableNumbers: currentRaffle.totalTickets -
          (currentRaffle.soldTickets?.length || 0) -
          updatedReservedTickets.length
      }

      await updateDoc(docRef, updatedRaffle)

      // Actualizar el estado local
      set(state => ({
        raffles: state.raffles.map(raffle =>
          raffle.id === raffleId ? { ...raffle, ...updatedRaffle } : raffle
        )
      }))

      return true
    } catch (error) {
      console.error('Error unreserving tickets:', error)
      throw error
    }
  },

  getAvailableTickets: (raffleId) => {
    const { raffles } = get()
    const raffle = raffles.find(r => r.id === raffleId)

    if (!raffle) return []

    const unavailableTickets = [
      ...(raffle.soldTickets || []),
      ...(raffle.reservedTickets || [])
    ]

    return Array.from({ length: raffle.totalTickets }, (_, i) => i + 1)
      .filter(num => !unavailableTickets.includes(num))
  }
}) 