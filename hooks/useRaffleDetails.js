'use client'

import { useState, useCallback } from 'react'
import { useRaffles } from '@/hooks/useRaffles'
import { toast } from 'sonner'

export function useRaffleDetails (id) {
  const { getRaffleById, updateRaffleWithPendingPurchase } = useRaffles()
  const [raffle, setRaffle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)

  const fetchRaffle = useCallback(async () => {
    try {
      setIsLoading(true)
      const raffleData = await getRaffleById(id)
      setRaffle(raffleData)
    } catch (err) {
      toast.error('Error al cargar la rifa', {
        description: 'Por favor, intenta nuevamente más tarde'
      })
    } finally {
      setIsLoading(false)
    }
  }, [id, getRaffleById])

  const handleSubmit = async data => {
    try {
      await updateRaffleWithPendingPurchase(id, data)
      setSubmittedData(data)
      setShowSuccessModal(true)
      await fetchRaffle()
    } catch (error) {
      toast.error('Error al procesar la reserva', {
        description: 'Por favor, intenta nuevamente'
      })
    }
  }

  return {
    raffle,
    isLoading,
    showSuccessModal,
    submittedData,
    fetchRaffle,
    handleSubmit,
    setShowSuccessModal
  }
}
