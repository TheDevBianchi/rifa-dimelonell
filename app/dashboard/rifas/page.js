'use client'
import React, { useState, useEffect } from 'react'
import CreateRaffle from '@/components/rifas/rifa-form'
import { Button } from '@/components/ui/button'
import { useRaffleStore } from '@/store/use-rifa-store'
import RaffleList from '@/components/rifas/raffle-list'
import { Plus, Loader2, Gift } from 'lucide-react'

function Page () {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { raffles, loading, error, getRaffles } = useRaffleStore()

  useEffect(() => {
    getRaffles()
  }, [getRaffles])

  return (
    <div className='container mx-auto p-4 md:p-6 space-y-6 md:space-y-8'>
      {/* Header Section */}
      <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-0'>
        <div>
          <h1 className='text-2xl md:text-3xl font-medium text-secondary'>
            Mis Rifas
          </h1>
          <p className='text-secondary-600 mt-1 text-sm md:text-base'>
            Gestiona y monitorea todas tus rifas activas
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className='w-full md:w-auto bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded transition-all duration-200 flex items-center justify-center md:justify-start gap-2 shadow-sm'
        >
          <Plus className='w-4 h-4 md:w-5 md:h-5' />
          Crear Nueva Rifa
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className='flex flex-col items-center justify-center py-8 md:py-12'>
          <Loader2 className='w-8 h-8 md:w-10 md:h-10 animate-spin text-accent' />
          <p className='text-secondary-600 mt-4 text-sm md:text-base'>
            Cargando tus rifas...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-3 md:p-4 text-center'>
          <p className='text-red-400 text-sm md:text-base'>{error}</p>
          <Button
            onClick={getRaffles}
            variant='outline'
            className='mt-2 text-red-400 hover:text-red-300 text-sm md:text-base border-red-500/20'
          >
            Intentar nuevamente
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && raffles.length === 0 && (
        <div className='text-center py-8 md:py-12 bg-principal-200/50 rounded-lg border border-principal-400/30 px-4'>
          <div className='max-w-md mx-auto'>
            <Gift className='w-10 h-10 md:w-12 md:h-12 text-secondary-600 mx-auto mb-3 md:mb-4' />
            <h3 className='text-lg md:text-xl font-medium text-secondary mb-2'>
              No hay rifas creadas
            </h3>
            <p className='text-secondary-600 mb-4 text-sm md:text-base'>
              Comienza creando tu primera rifa para empezar a vender tickets
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className='w-full md:w-auto bg-accent hover:bg-accent/90 text-white'
            >
              Crear mi primera rifa
            </Button>
          </div>
        </div>
      )}

      {/* Create Raffle Modal */}
      {isModalOpen && <CreateRaffle onClose={() => setIsModalOpen(false)} />}

      {/* Raffle List */}
      {!loading && !error && raffles.length > 0 && (
        <div className='bg-principal-100 rounded-lg border border-principal-400/30 p-3 md:p-5'>
          <RaffleList raffles={raffles} />
        </div>
      )}
    </div>
  )
}

export default Page
