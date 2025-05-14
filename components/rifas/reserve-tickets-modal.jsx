import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import TicketGrid from './ticket-grid'

export function ReserveTicketsModal({
  isOpen,
  onClose,
  onConfirm,
  raffle,
  isReserving,
}) {
  const [selectedTickets, setSelectedTickets] = useState([])

  const handleTicketClick = (number) => {
    setSelectedTickets((prev) =>
      prev.includes(number)
        ? prev.filter((n) => n !== number)
        : [...prev, number]
    )
  }

  const handleConfirm = () => {
    onConfirm(selectedTickets)
    setSelectedTickets([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[800px]'>
        <DialogHeader>
          <DialogTitle>Reservar Tickets</DialogTitle>
          <DialogDescription>
            Selecciona los tickets que deseas reservar. Los tickets en rojo
            están vendidos y los amarillos están reservados.
          </DialogDescription>
        </DialogHeader>

        <div className='max-h-[60vh] overflow-y-auto p-4'>
          <TicketGrid
            totalTickets={raffle?.totalTickets || 0}
            soldTickets={raffle?.soldTickets || []}
            reservedTickets={raffle?.reservedTickets || []}
            selectedTickets={selectedTickets}
            onTicketClick={handleTicketClick}
          />
        </div>

        <DialogFooter className='gap-2'>
          <Button variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isReserving || selectedTickets.length === 0}>
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
  )
}
