import { useCallback } from 'react'
import { db } from '@/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useRaffleStore } from '@/store/use-rifa-store'

export function useRaffles() {
  const store = useRaffleStore()

  const getRaffleById = useCallback(async (id) => {
    try {
      const raffleRef = doc(db, 'raffles', id)
      const raffleSnap = await getDoc(raffleRef)

      if (!raffleSnap.exists()) {
        throw new Error('Rifa no encontrada')
      }

      const data = raffleSnap.data()
      const raffleData = {
        id: raffleSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        endDate: data.endDate?.toDate?.() || data.endDate
      }

      return raffleData
    } catch (error) {
      console.error('Error fetching raffle:', error)
      throw error
    }
  }, [])

  const unreserveTickets = useCallback(async (raffleId, ticketsToUnreserve) => {
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

      // Actualizar la rifa
      await updateDoc(docRef, {
        reservedTickets: updatedReservedTickets,
        availableNumbers: currentRaffle.totalTickets -
          (currentRaffle.soldTickets?.length || 0) -
          updatedReservedTickets.length
      })

      return true
    } catch (error) {
      console.error('Error unreserving tickets:', error)
      throw error
    }
  }, [])

  return {
    ...store,
    getRaffleById,
    updateRaffle: store.updateRaffle,
    createRaffle: store.createRaffle,
    deleteRaffle: store.deleteRaffle,
    unreserveTickets
  }
}
