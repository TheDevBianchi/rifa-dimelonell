import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentMethodSchema } from '@/schema/paymentMethodSchema'
import { useSettingsStore } from '@/store/use-settings-store'
import { toast } from 'sonner'
import { X, Loader2 } from 'lucide-react'
import { FormField } from '../ui/form-field'
import { Input } from '../ui/input'

export function EditPaymentMethodModal () {
  const { selectedMethod, isEditModalOpen, setEditModal, updatePaymentMethod } =
    useSettingsStore()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      name: '',
      identificationNumber: '',
      bankName: '',
      bankCode: '',
      email: '',
      contactName: '',
      phone: ''
    }
  })

  useEffect(() => {
    if (selectedMethod) {
      reset(selectedMethod)
    }
  }, [selectedMethod, reset])

  const onSubmit = async data => {
    try {
      await updatePaymentMethod(selectedMethod.id, data)
      toast.success('Método de pago actualizado exitosamente')
      setEditModal(false)
    } catch (error) {
      toast.error('Error al actualizar el método de pago')
    }
  }

  if (!isEditModalOpen) return null

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50'>
      <div className='min-h-screen px-4 flex items-center justify-center'>
        <div className='bg-principal-200 rounded-lg w-full max-w-md p-6 border border-secondary shadow-md'>
          <div className='flex justify-between items-center mb-4 border-b border-secondary pb-2'>
            <h2 className='text-xl font-semibold text-secondary'>Editar Método de Pago</h2>
            <button
              onClick={() => setEditModal(false)}
              className='text-secondary-600 hover:text-accent'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-4'>
              <FormField label='Nombre del método de pago'>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: 'El nombre es requerido' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder='Ej: PayPal, Zelle, etc.'
                      className='bg-principal-300/40 border-secondary text-secondary placeholder:text-secondary-600 focus-visible:ring-accent'
                    />
                  )}
                />
                {errors.name && (
                  <p className='text-sm text-accent'>{errors.name.message}</p>
                )}
              </FormField>

              <FormField label='Número de identificación'>
                <Controller
                  name='identificationNumber'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder='Número de identificación'
                      className='bg-principal-300/40 border-secondary text-secondary placeholder:text-secondary-600 focus-visible:ring-accent'
                    />
                  )}
                />
              </FormField>

              <FormField label='Nombre del banco'>
                <Controller
                  name='bankName'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder='Nombre del banco'
                      className='bg-principal-300/40 border-secondary text-secondary placeholder:text-secondary-600 focus-visible:ring-accent'
                    />
                  )}
                />
              </FormField>

              <FormField label='Código del banco'>
                <Controller
                  name='bankCode'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder='Código del banco'
                      className='bg-principal-300/40 border-secondary text-secondary placeholder:text-secondary-600 focus-visible:ring-accent'
                    />
                  )}
                />
              </FormField>

              <FormField label='Email'>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type='email'
                      placeholder='Email de contacto'
                      className='bg-principal-300/40 border-secondary text-secondary placeholder:text-secondary-600 focus-visible:ring-accent'
                    />
                  )}
                />
              </FormField>

              <FormField label='Nombre de contacto'>
                <Controller
                  name='contactName'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder='Nombre de la persona de contacto'
                      className='bg-principal-300/40 border-secondary text-secondary placeholder:text-secondary-600 focus-visible:ring-accent'
                    />
                  )}
                />
              </FormField>

              <FormField label='Teléfono'>
                <Controller
                  name='phone'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder='Número de teléfono'
                      className='bg-principal-300/40 border-secondary text-secondary placeholder:text-secondary-600 focus-visible:ring-accent'
                    />
                  )}
                />
              </FormField>
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-accent text-white p-2.5 rounded hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {isSubmitting ? (
                <span className='flex items-center justify-center gap-2'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span>Actualizando...</span>
                </span>
              ) : (
                'Actualizar Método de Pago'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
