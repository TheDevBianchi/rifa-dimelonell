import { Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { FormField } from './FormField'
import { CreditCard, Receipt, AlertCircle, Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSettingsStore } from '@/store/use-settings-store'
import { useEffect } from 'react'

export function PaymentFields({ form }) {
  const {
    control,
    formState: { errors },
    watch,
  } = form

  const { paymentMethods, getPaymentMethods, loading, error } =
    useSettingsStore()

  const selectedMethod = watch('paymentMethod')

  useEffect(() => {
    getPaymentMethods()
  }, [getPaymentMethods])

  const selectedPaymentMethod = paymentMethods.find(
    (method) => method.id === selectedMethod
  )

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-100'>
          Información de Pago
        </h2>
        {selectedMethod && (
          <span className='text-sm text-gray-400'>
            Método seleccionado: {selectedPaymentMethod?.name}
          </span>
        )}
      </div>

      <FormField
        label='Método de Pago'
        error={errors.paymentMethod}
        icon={<CreditCard className='w-4 h-4 text-gray-400' />}>
        <Controller
          name='paymentMethod'
          control={control}
          rules={{ required: 'Selecciona un método de pago' }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger
                className='w-full bg-principal-200 border-gray-700'
                disabled={loading}>
                {loading ? (
                  <div className='flex items-center gap-2'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span>Cargando métodos...</span>
                  </div>
                ) : (
                  <SelectValue placeholder='Selecciona un método de pago' />
                )}
              </SelectTrigger>
              <SelectContent className='bg-principal-100 border-gray-700'>
                {paymentMethods.map((method) => (
                  <SelectItem
                    key={method.id}
                    value={method.id}
                    className='text-gray-200 hover:bg-gray-700 focus:bg-gray-700'>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      {selectedPaymentMethod && (
        <div className='space-y-4'>
          <FormField
            label='Referencia de Pago'
            error={errors.paymentReference}
            icon={<Receipt className='w-4 h-4 text-gray-400' />}>
            <Controller
              name='paymentReference'
              control={control}
              rules={{
                required: 'La referencia de pago es requerida',
                minLength: {
                  value: 6,
                  message: 'La referencia debe tener al menos 6 caracteres',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  className='bg-gray-800/50 border-gray-700'
                  placeholder='Número de referencia o ID de transacción'
                />
              )}
            />
          </FormField>

          <div className='flex items-start gap-2 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20'>
            <AlertCircle className='w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0' />
            <div className='text-sm text-blue-300'>
              <p className='font-medium mb-1'>Información de pago:</p>
              {selectedPaymentMethod.email && (
                <p>Email: {selectedPaymentMethod.email}</p>
              )}
              {selectedPaymentMethod.contactName && (
                <p>Contacto: {selectedPaymentMethod.contactName}</p>
              )}
              {selectedPaymentMethod.phone && (
                <p>Teléfono: {selectedPaymentMethod.phone}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
