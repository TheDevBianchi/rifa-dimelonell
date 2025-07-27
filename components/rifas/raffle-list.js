import React, { useState } from 'react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { DeleteRaffleModal } from './delete-raffle-modal'
import { useRaffleStore } from '@/store/use-rifa-store'
import { toast } from 'sonner'
import { Trash2, Ticket } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { ReserveTicketsButton } from '../dashboard/reserve-tickets-button'

function RaffleList ({ raffles }) {
  const [selectedRaffle, setSelectedRaffle] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteRaffle = useRaffleStore(state => state.deleteRaffle)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteRaffle(selectedRaffle.id)
      toast.success('Rifa eliminada exitosamente', {
        description: 'La rifa y todos sus recursos han sido eliminados.'
      })
    } catch (error) {
      toast.error('Error al eliminar la rifa', {
        description:
          error.message || 'Ha ocurrido un error al intentar eliminar la rifa.'
      })
    } finally {
      setIsDeleting(false)
      setSelectedRaffle(null)
    }
  }

  if (!raffles.length) {
    return (
      <div className='text-center py-8 bg-principal-200/50 rounded-lg p-6 border border-principal-400/30' role='status'>
        <p className='text-secondary-600'>No hay rifas creadas aún.</p>
      </div>
    )
  }

  return (
    <>
      <div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
        role='list'
        aria-label='Lista de rifas disponibles'
      >
        {raffles.map(raffle => {
          const soldTickets = raffle.soldTickets?.length || 0
          const reservedTickets = raffle.reservedTickets?.length || 0
          const progress =
            ((soldTickets + reservedTickets) / raffle.totalTickets) * 100

          return (
            <div
              key={raffle.id}
              className='bg-principal-100 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-principal-400/30'
              role='listitem'
            >
              <h3 className='text-lg font-medium text-secondary mb-2'>
                {raffle.title}
              </h3>

              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-secondary-600'>Precio:</span>
                  <span className='text-accent font-medium'>
                    {(raffle.price ).toLocaleString('es-CO')} COP
                  </span>
                </div>

                <div className='flex items-center gap-2'>
                  <Ticket className='w-4 h-4 text-secondary-600' />
                  <div className='flex-1'>
                    <Progress value={progress} className='h-2 bg-principal-200' />
                  </div>
                </div>

                <div className='grid grid-cols-3 gap-2 text-sm'>
                  <div className='text-center'>
                    <span className='block text-secondary-600'>Disponibles</span>
                    <span className='font-medium text-secondary'>
                      {raffle.availableNumbers}
                    </span>
                  </div>
                  <div className='text-center'>
                    <span className='block text-secondary-600'>Reservados</span>
                    <span className='font-medium text-amber-500'>
                      {reservedTickets}
                    </span>
                  </div>
                  <div className='text-center'>
                    <span className='block text-secondary-600'>Vendidos</span>
                    <span className='font-medium text-accent'>
                      {soldTickets}
                    </span>
                  </div>
                </div>

                <div className='text-sm text-secondary-600'>
                  Creada el: {formatDate(raffle.createdAt)}
                </div>
              </div>

              <div className='mt-4 flex justify-between items-center gap-3'>
                <Link
                  href={`rifas/${raffle.id}`}
                  className='flex-1 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/90 transition-colors text-center'
                  aria-label={`Ver detalles de la rifa ${raffle.title}`}
                >
                  Ver Rifa
                </Link>

                <div className='flex gap-2'>
                  {raffle.randomTickets ? null : (
                    <ReserveTicketsButton raffle={raffle} />
                  )}
                  <button
                    onClick={() => setSelectedRaffle(raffle)}
                    className='p-2 text-red-500 hover:bg-principal-200 rounded-full transition-colors'
                    aria-label={`Eliminar rifa ${raffle.title}`}
                  >
                    <Trash2 className='w-5 h-5' />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <DeleteRaffleModal
        isOpen={!!selectedRaffle}
        onClose={() => setSelectedRaffle(null)}
        onConfirm={handleDelete}
        raffle={selectedRaffle}
        isDeleting={isDeleting}
      />
    </>
  )
}

export default RaffleList
