import { formatDate } from '@/lib/utils'
import { PurchaseInfo } from './purchase-info'
import { ActionButton } from './action-button'
import { useSettingsStore } from '@/store/use-settings-store'
import { useEffect } from 'react'

export function PurchaseCard ({ purchase, loadingStates, onApprove, onReject }) {
  const { paymentMethods, getPaymentMethods } = useSettingsStore()
  
  useEffect(() => {
    if (paymentMethods.length === 0) {
      getPaymentMethods()
    }
  }, [paymentMethods.length, getPaymentMethods])
  
  // Buscar el método de pago por su ID para mostrar el nombre
  const paymentMethod = paymentMethods.find(method => method.id === purchase.paymentMethod)
  const paymentMethodName = paymentMethod ? paymentMethod.name : purchase.paymentMethod
  
  return (
    <div className='bg-principal-100 rounded-lg p-4 shadow-sm border border-principal-400/30'>
      <div className='mb-3'>
        <h3 className='font-medium text-lg text-secondary'>
          {purchase.raffleName}
        </h3>
        <p className='text-secondary-600 text-sm'>
          Fecha: {formatDate(purchase.createdAt)}
        </p>
      </div>

      <div className='space-y-2 text-secondary-700'>
        <PurchaseInfo label='Comprador' value={purchase.name} />
        <PurchaseInfo label='Email' value={purchase.email} />
        <PurchaseInfo label='Teléfono' value={purchase.phone} />
        <PurchaseInfo label='Método de pago' value={paymentMethodName} />
        <PurchaseInfo label='Referencia' value={purchase.paymentReference} />
        <PurchaseInfo
          label='Tickets'
          value={`${purchase.selectedTickets.length} tickets`}
        />
        <PurchaseInfo
          label='Total'
          value={`${(
            purchase.selectedTickets.length * purchase.rafflePrice * 4000
          ).toLocaleString('es-CO')} COP`}
        />
      </div>

      <div className='mt-4 flex gap-2'>
        <ActionButton
          onClick={() => onApprove(purchase.raffleId, purchase)}
          disabled={loadingStates.approve[purchase.createdAt.seconds]}
          variant='approve'
          isLoading={loadingStates.approve[purchase.createdAt.seconds]}
        />
        <ActionButton
          onClick={() => onReject(purchase.raffleId, purchase)}
          disabled={loadingStates.reject[purchase.createdAt.seconds]}
          variant='reject'
          isLoading={loadingStates.reject[purchase.createdAt.seconds]}
        />
      </div>
    </div>
  )
}
