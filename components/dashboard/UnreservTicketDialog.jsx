import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'

export function UnreservTicketDialog({
  selectedTicket,
  isUnreserving,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog open={!!selectedTicket} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Liberar Ticket #{selectedTicket}</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas liberar este ticket reservado?
          </DialogDescription>
        </DialogHeader>
        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isUnreserving}
            className='bg-red-500 hover:bg-red-600'>
            {isUnreserving ? (
              <>
                <Loader2 size={16} className='animate-spin mr-2' />
                Liberando...
              </>
            ) : (
              'Liberar Ticket'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
