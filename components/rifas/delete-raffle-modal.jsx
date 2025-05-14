import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DeleteRaffleModal({
  isOpen,
  onClose,
  onConfirm,
  raffle,
  isDeleting,
}) {
  const hasPendingPurchases = raffle?.pendingPurchases?.length > 0
  const hasConfirmedUsers = raffle?.users?.length > 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className='flex items-center gap-3 text-amber-500'>
            <AlertTriangle size={24} />
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </div>
        </DialogHeader>

        <div className='space-y-4'>
          <DialogDescription className='text-gray-600'>
            ¿Estás seguro de que deseas eliminar la rifa &quot;{raffle?.title}
            ?&quot;
          </DialogDescription>

          {(hasPendingPurchases || hasConfirmedUsers) && (
            <div className='bg-amber-50 border border-amber-200 rounded-md p-4 text-sm'>
              <p className='font-medium text-amber-800 mb-2'>¡Atención!</p>
              {hasPendingPurchases && (
                <p className='text-amber-700 mb-2'>
                  Esta rifa tiene {raffle.pendingPurchases.length} compras
                  pendientes.
                </p>
              )}
              {hasConfirmedUsers && (
                <p className='text-amber-700'>
                  Esta rifa tiene {raffle.users.length} tickets vendidos.
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className='flex gap-3'>
          <Button variant='ghost' onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 size={16} className='animate-spin mr-2' />
                Eliminando...
              </>
            ) : (
              'Eliminar Rifa'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
