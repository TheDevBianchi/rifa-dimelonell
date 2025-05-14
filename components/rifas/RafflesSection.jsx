'use client'

import { useEffect } from 'react'
import { useRaffleStore } from '@/store/use-rifa-store'
import { RaffleCard, RaffleCardSkeleton } from './raffle-card'

const LoadingState = () => (
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
    {[...Array(6)].map((_, index) => (
      <RaffleCardSkeleton key={index} />
    ))}
  </div>
)

const ErrorState = ({ error, onRetry }) => (
  <div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
    <div className='bg-red-500/10 text-red-500 p-4 rounded-lg max-w-md'>
      <h3 className='text-lg font-semibold mb-2'>Error al cargar las rifas</h3>
      <p className='text-sm'>{error}</p>
      <button
        onClick={onRetry}
        className='mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors'>
        Intentar nuevamente
      </button>
    </div>
  </div>
)

const EmptyState = () => (
  <div className='rounded-lg border border-gray-800 p-12 text-center'>
    <p className='text-gray-400 text-lg'>
      No hay rifas disponibles en este momento.
    </p>
  </div>
)

export const RafflesSection = () => {
  const { raffles, loading, error, getRaffles } = useRaffleStore()

  useEffect(() => {
    getRaffles()
  }, [getRaffles])

  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} onRetry={getRaffles} />
  if (raffles.length === 0) return <EmptyState />

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-transparent'>
      {raffles.map((raffle) => (
        <RaffleCard key={raffle.id} raffle={raffle} />
      ))}
    </div>
  )
}
