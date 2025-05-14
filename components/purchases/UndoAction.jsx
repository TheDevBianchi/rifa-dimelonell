'use client'

import { useState, memo, useCallback } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Undo2 } from 'lucide-react'
import { toast } from 'sonner'
import { undoPurchase } from '@/app/dashboard/compras/actions'

export const UndoAction = memo(({ purchase, onPurchaseUpdate, selectedRaffle }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const handleUndo = useCallback(async () => {
    if (isPending) return

    setIsPending(true)
    try {
      const result = await undoPurchase(purchase, selectedRaffle)
      if (result.success) {
        toast.success(result.message || 'Compra deshecha exitosamente')
        setIsOpen(false)
        if (typeof onPurchaseUpdate === 'function') {
          onPurchaseUpdate(prevPurchases => 
            prevPurchases.filter(p => p.id !== purchase.id)
          )
        }
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`)
    } finally {
      setIsPending(false)
    }
  }, [purchase, isPending, onPurchaseUpdate, selectedRaffle])

  const formatTickets = (tickets) => {
    if (!tickets || tickets.length === 0) return 'sin tickets'
    return tickets.sort((a, b) => a - b).join(', ')
  }

  const getPurchaseDetails = () => {
    const details = []
    
    if (purchase.name) details.push(`Nombre: ${purchase.name}`)
    if (purchase.email) details.push(`Email: ${purchase.email}`)
    if (purchase.phone) details.push(`Teléfono: ${purchase.phone}`)
    
    return details.join('\n')
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        disabled={isPending}
      >
        <Undo2 className="h-4 w-4 mr-2" />
        Deshacer
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Deshacer esta compra?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p className="whitespace-pre-line font-medium">
                {getPurchaseDetails()}
              </p>
              <p>
                Tickets seleccionados: <span className="font-medium">{formatTickets(purchase.selectedTickets)}</span>
              </p>
              <p>
                Rifa: <span className="font-medium">{purchase.raffleName}</span>
              </p>
              <p className="text-destructive mt-4">
                Esta acción eliminará permanentemente la compra y no se puede deshacer.
                ¿Estás seguro de querer continuar?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUndo}
              disabled={isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isPending ? 'Procesando...' : 'Eliminar Compra'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
})

UndoAction.displayName = 'UndoAction' 