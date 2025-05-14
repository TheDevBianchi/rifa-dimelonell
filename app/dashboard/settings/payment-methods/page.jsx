'use client'

import { useEffect } from 'react'
import { useSettingsStore } from '@/store/use-settings-store'
import { PaymentMethodForm } from '@/components/settings/payment-method-form'
import { PaymentMethodList } from '@/components/settings/payment-method-list'
import { EditPaymentMethodModal } from '@/components/settings/edit-payment-method-modal'

export default function PaymentMethodsPage () {
  const { getPaymentMethods } = useSettingsStore()

  useEffect(() => {
    getPaymentMethods()
  }, [getPaymentMethods])

  return (
    <div className='container mx-auto p-6 bg-principal-200'>
      <h1 className='text-2xl font-bold mb-6 text-secondary border-b border-secondary pb-2'>Métodos de Pago</h1>
      <div className='grid gap-6 grid-cols-1 lg:grid-cols-2'>
        <div className='bg-principal-100 p-6 rounded-lg border border-secondary shadow-md'>
          <PaymentMethodForm />
        </div>
        <div className='bg-principal-100 p-6 rounded-lg border border-secondary shadow-md'>
          <PaymentMethodList />
        </div>
      </div>
      <EditPaymentMethodModal />
    </div>
  )
}
