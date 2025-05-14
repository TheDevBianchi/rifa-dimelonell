'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRaffleStore } from '@/store/use-rifa-store'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import TicketGrid from '../rifas/ticket-grid'

export function ReserveTicketsButton ({ raffle }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isReserving, setIsReserving] = useState(false)
  const [selectedTickets, setSelectedTickets] = useState([])
  const reserveTickets = useRaffleStore(state => state.reserveTickets)

  const handleTicketClick = number => {
    setSelectedTickets(prev =>
      prev.includes(number) ? prev.filter(n => n !== number) : [...prev, number]
    )
  }

  const handleReserveTickets = async () => {
    if (selectedTickets.length === 0) {
      toast.error('Selecciona al menos un ticket para reservar')
      return
    }

    setIsReserving(true)
    try {
      await reserveTickets(raffle.id, selectedTickets)
      toast.success('Tickets reservados exitosamente', {
        description: `Se han reservado ${selectedTickets.length} tickets`
      })
      setIsModalOpen(false)
      setSelectedTickets([]) // Limpiar selección
    } catch (error) {
      toast.error('Error al reservar tickets', {
        description:
          error.message ||
          'Ha ocurrido un error al intentar reservar los tickets'
      })
    } finally {
      setIsReserving(false)
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setSelectedTickets([]) // Limpiar selección al cerrar
  }

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant='outline'
        size='sm'
        className='bg-amber-500 hover:bg-amber-600 text-white'
      >
        Reservar
      </Button>

      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className='sm:max-w-[800px] bg-gray-900 text-gray-100'>
          <DialogHeader>
            <DialogTitle>Reservar Tickets - {raffle.title}</DialogTitle>
            <DialogDescription className='text-gray-400'>
              Selecciona los tickets que deseas reservar. Los tickets en rojo
              están vendidos, los amarillos están reservados y los verdes son tu
              selección actual.
            </DialogDescription>
          </DialogHeader>

          <div className='max-h-[60vh] overflow-y-auto p-4'>
            <TicketGrid
              totalTickets={raffle.totalTickets}
              soldTickets={raffle.soldTickets || []}
              reservedTickets={raffle.reservedTickets || []}
              selectedTickets={selectedTickets}
              onTicketClick={handleTicketClick}
            />
          </div>

          <div className='px-4 py-2 bg-gray-800 rounded-md'>
            <p className='text-sm text-white'>
              Tickets seleccionados:{' '}
              <span className='font-bold text-primary'>
                {selectedTickets.length}
              </span>
            </p>
          </div>

          <DialogFooter className='gap-2'>
            <Button
              variant='outline'
              onClick={handleClose}
              className='bg-gray-800 hover:bg-gray-700'
            >
              Cancelar
            </Button>
            <Button
              onClick={handleReserveTickets}
              disabled={isReserving || selectedTickets.length === 0}
              className='bg-amber-500 hover:bg-amber-600 text-white'
            >
              {isReserving ? (
                <>
                  <Loader2 size={16} className='animate-spin mr-2' />
                  Reservando...
                </>
              ) : (
                `Reservar ${selectedTickets.length} tickets`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
