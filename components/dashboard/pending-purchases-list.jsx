'use client'

import { useEffect, useState } from 'react'
import { useRaffles } from '@/hooks/useRaffles'
import { toast } from 'sonner'
import { PurchaseCard } from './purchase-card'
import { EmptyState } from './empty-state'

function PendingPurchasesList() {
  const { raffles, getRaffles, approvePendingPurchase, rejectPendingPurchase } =
    useRaffles()

  useEffect(() => {
    getRaffles()
  }, [getRaffles])

  const [loadingStates, setLoadingStates] = useState({
    approve: {},
    reject: {},
  })

  const handleApprove = async (raffleId, purchase) => {
    setLoadingStates((prev) => ({
      ...prev,
      approve: { ...prev.approve, [purchase.createdAt.seconds]: true },
    }))

    try {
      const raffle = raffles.find((r) => r.id === raffleId)

      let ticketsToApprove = purchase.selectedTickets
      let updatedReservedTickets = [...(raffle.reservedTickets || [])]

      if (raffle.randomTickets) {
        const soldTickets = raffle.soldTickets || []
        const totalTickets = raffle.totalTickets
        const ticketsNeeded = purchase.selectedTickets.length
        const availableTickets = Array.from({ length: totalTickets }, (_, i) =>
          (i + 1).toString().padStart(3, '0')
        ).filter((number) => !soldTickets.includes(number))

        const shuffledTickets = availableTickets.sort(() => Math.random() - 0.5)
        ticketsToApprove = shuffledTickets.slice(0, ticketsNeeded)

        if (ticketsToApprove.length < ticketsNeeded) {
          throw new Error('No hay suficientes tickets disponibles')
        }

        updatedReservedTickets = updatedReservedTickets.filter(
          (_, index) => index >= ticketsNeeded
        )
      }

      await approvePendingPurchase(raffleId, {
        ...purchase,
        selectedTickets: ticketsToApprove,
        reservedTickets: updatedReservedTickets,
      })

      toast.success('Compra aprobada exitosamente', {
        description: `Se ha confirmado la compra de ${purchase.selectedTickets.length} tickets para ${purchase.name}. Se enviará la confirmación a ${purchase.email}`,
        duration: 5000,
        action: {
          label: 'Cerrar',
          onClick: () => console.log('Toast closed'),
        },
      })
    } catch (error) {
      toast.error('Error al aprobar la compra', {
        description: `Ha ocurrido un error al intentar aprobar la compra. Por favor, inténtalo nuevamente. ${error.message}`,
        duration: 5000,
      })
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        approve: { ...prev.approve, [purchase.createdAt.seconds]: false },
      }))
    }
  }

  const handleReject = async (raffleId, purchase) => {
    setLoadingStates((prev) => ({
      ...prev,
      reject: { ...prev.reject, [purchase.createdAt.seconds]: true },
    }))

    try {
      await rejectPendingPurchase(raffleId, purchase)
      toast.success('Compra rechazada exitosamente', {
        description: `Se han liberado ${purchase.selectedTickets.length} tickets reservados por ${purchase.name}`,
        duration: 5000,
        action: {
          label: 'Cerrar',
          onClick: () => console.log('Toast closed'),
        },
      })
    } catch (error) {
      toast.error('Error al rechazar la compra', {
        description:
          'Ha ocurrido un error al intentar rechazar la compra. Por favor, inténtalo nuevamente.',
        duration: 5000,
      })
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        reject: { ...prev.reject, [purchase.createdAt.seconds]: false },
      }))
    }
  }

  const pendingPurchases = raffles.flatMap((raffle) =>
    (raffle.pendingPurchases || []).map((purchase) => ({
      ...purchase,
      raffleId: raffle.id,
      raffleName: raffle.title,
      rafflePrice: raffle.price,
    }))
  )

  if (pendingPurchases.length === 0) {
    return <EmptyState />
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {pendingPurchases.map((purchase, index) => (
        <PurchaseCard
          key={`${purchase.raffleId}-${index}`}
          purchase={purchase}
          loadingStates={loadingStates}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ))}
    </div>
  )
}

export default PendingPurchasesList
