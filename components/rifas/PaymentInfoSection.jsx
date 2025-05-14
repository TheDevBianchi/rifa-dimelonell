import { Controller } from 'react-hook-form'
import { CreditCard, Receipt, AlertCircle, Loader2, Copy, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

const CopyButton = ({ text, label }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('¡Copiado!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Error al copiar')
    }
  }

  return (
    <button
      onClick={copyToClipboard}
      className="group inline-flex items-center gap-1 text-secondary-600 hover:text-accent transition-colors"
      title="Copiar al portapapeles"
      type='button'
    >
      {label}
      {copied ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
      ) : (
        <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  )
}

const PaymentInfoSection = ({
  control,
  errors,
  paymentMethods,
  loading,
  selectedMethod,
}) => {
  const selectedPaymentMethod = paymentMethods.find(
    (method) => method.id === selectedMethod
  )

  return (
    <div className='space-y-4 bg-principal-200 p-4 rounded-lg border border-principal-400/30 transition-all duration-300 hover:shadow-sm'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-medium text-secondary flex items-center gap-2'>
          <CreditCard className='w-4 h-4 text-accent' />
          Información de Pago
        </h2>
        {selectedMethod && (
          <span className='text-sm text-secondary-600'>
            Método seleccionado: {selectedPaymentMethod?.name}
          </span>
        )}
      </div>

      <div className='space-y-3'>
        {/* Método de Pago */}
        <div className='space-y-1'>
          <label className='text-sm font-medium text-secondary-700 flex items-center gap-2'>
            <CreditCard className='w-3.5 h-3.5 text-secondary-600' />
            Método de Pago
          </label>
          <Controller
            name='paymentMethod'
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className='bg-principal-200 border-principal-400/30 focus:border-accent/50 transition-colors'>
                  {loading ? (
                    <div className='flex items-center gap-2'>
                      <Loader2 className='h-3.5 w-3.5 animate-spin text-secondary-600' />
                      <span className='text-secondary-600'>Cargando métodos...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder='Selecciona un método de pago' />
                  )}
                </SelectTrigger>
                <SelectContent className='bg-principal-100 border-principal-400/30'>
                  {paymentMethods.map((method) => (
                    <SelectItem
                      key={method.id}
                      value={method.id}
                      className='text-secondary hover:bg-principal-200 focus:bg-principal-200'>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Referencia de Pago */}
        {selectedMethod && (
          <div className='space-y-1'>
            <label className='text-sm font-medium text-secondary-700 flex items-center gap-2'>
              <Receipt className='w-3.5 h-3.5 text-secondary-600' />
              Referencia de Pago
            </label>
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
                  className='bg-principal-100 border-principal-400/30 focus:border-accent/50 transition-colors'
                  placeholder='Número de referencia o ID de transacción'
                />
              )}
            />
            {errors.paymentReference && (
              <p className='text-red-400 text-xs'>
                {errors.paymentReference.message}
              </p>
            )}
          </div>
        )}

        {/* Información del método de pago */}
        {selectedPaymentMethod && (
          <div className='flex flex-col gap-3 p-3 rounded-md bg-principal-300/20 border border-principal-400/30'>
            <div className='flex items-center gap-2'>
              <AlertCircle className='w-3.5 h-3.5 text-accent flex-shrink-0' />
              <p className='text-sm font-medium text-secondary'>Información de pago</p>
            </div>
            
            <div className='grid gap-2 text-xs'>
              {selectedPaymentMethod.name && (
                <div className='flex flex-col md:flex-row justify-between items-center p-1.5 rounded bg-principal-100 border border-principal-400/20'>
                  <span className='text-secondary-700'>Método:</span>
                  <CopyButton text={selectedPaymentMethod.name} label={selectedPaymentMethod.name} />
                </div>
              )}
              {selectedPaymentMethod.identificationNumber && (
                <div className='flex flex-col md:flex-row justify-between items-center p-1.5 rounded bg-principal-100 border border-principal-400/20'>
                  <span className='text-secondary-700'>Cédula:</span>
                  <CopyButton text={selectedPaymentMethod.identificationNumber} label={selectedPaymentMethod.identificationNumber} />
                </div>
              )}
              {selectedPaymentMethod.bankName && (
                <div className='flex flex-col md:flex-row justify-between items-center p-1.5 rounded bg-principal-100 border border-principal-400/20'>
                  <span className='text-secondary-700'>Banco:</span>
                  <CopyButton text={selectedPaymentMethod.bankName} label={selectedPaymentMethod.bankName} />
                </div>
              )}
              {selectedPaymentMethod.accountNumber && (
                <div className='flex flex-col md:flex-row justify-between items-center p-1.5 rounded bg-principal-100 border border-principal-400/20'>
                  <span className='text-secondary-700'>Cuenta:</span>
                  <CopyButton text={selectedPaymentMethod.accountNumber} label={selectedPaymentMethod.accountNumber} />
                </div>
              )}
              {selectedPaymentMethod.accountType && (
                <div className='flex flex-col md:flex-row justify-between items-center p-1.5 rounded bg-principal-100 border border-principal-400/20'>
                  <span className='text-secondary-700'>Tipo:</span>
                  <CopyButton text={selectedPaymentMethod.accountType} label={selectedPaymentMethod.accountType} />
                </div>
              )}
              {selectedPaymentMethod.email && (
                <div className='flex flex-col md:flex-row justify-between items-center p-1.5 rounded bg-principal-100 border border-principal-400/20'>
                  <span className='text-secondary-700'>Email:</span>
                  <CopyButton text={selectedPaymentMethod.email} label={selectedPaymentMethod.email} />
                </div>
              )}
              {selectedPaymentMethod.phone && (
                <div className='flex flex-col md:flex-row justify-between items-center p-1.5 rounded bg-principal-100 border border-principal-400/20'>
                  <span className='text-secondary-700'>Teléfono:</span>
                  <CopyButton text={selectedPaymentMethod.phone} label={selectedPaymentMethod.phone} />
                </div>
              )}
              {selectedPaymentMethod.username && (
                <div className='flex flex-col md:flex-row justify-between items-center p-1.5 rounded bg-principal-100 border border-principal-400/20'>
                  <span className='text-secondary-700'>Usuario:</span>
                  <CopyButton text={selectedPaymentMethod.username} label={selectedPaymentMethod.username} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentInfoSection
