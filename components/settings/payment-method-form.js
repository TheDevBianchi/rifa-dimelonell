'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSettingsStore } from '@/store/use-settings-store'
import { paymentMethodSchema } from '@/schema/paymentMethodSchema'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { FormField } from '../ui/form-field'
import { Input } from '../ui/input'

export function PaymentMethodForm () {
  const { addPaymentMethod } = useSettingsStore()

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
      accountNumber: '',
      accountType: '',
      email: '',
      contactName: '',
      phone: ''
    }
  })

  const onSubmit = async data => {
    try {
      await addPaymentMethod(data)
      toast.success('Método de pago agregado exitosamente')
      reset()
    } catch (error) {
      toast.error('Error al agregar el método de pago')
    }
  }

  return (
    <div className='bg-principal-200 backdrop-blur-xl p-4 md:p-6 rounded-lg border border-secondary shadow-md'>
      <h2
        className='text-lg md:text-xl font-medium text-secondary mb-3 md:mb-4 border-b border-secondary pb-2'
        id='payment-method-form'
      >
        Agregar Método de Pago
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-3 md:space-y-4'
        aria-labelledby='payment-method-form'
        noValidate
      >
        <FormField
          label='Nombre del método de pago'
          error={errors.name}
          optional
        >
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <Input
                {...field}
                id='name'
                name='name'
                placeholder='ej: PayPal, Zelle, etc.'
                required
                error={errors.name}
                className="bg-principal-300/40 border-secondary text-secondary placeholder:text-secondary-600 focus-visible:ring-accent"
              />
            )}
          />
        </FormField>

        <FormField
          label='Pasaporte o PPT'
          error={errors.identificationNumber}
          optional={false}
        >
          <Controller
            control={control}
            name='identificationNumber'
            render={({ field }) => (
              <Input
                {...field}
                id='identificationNumber'
                name='identificationNumber'
                placeholder='V-12345678'
                error={errors.identificationNumber}
                className="bg-principal-300/40 border-secondary text-secondary placeholder:text-secondary-600 focus-visible:ring-accent"
              />
            )}
          />
        </FormField>

        <FormField label='Nombre del Banco' error={errors.bankName} optional>
          <Controller
            control={control}
            name='bankName'
            render={({ field }) => (
              <Input
                {...field}
                id='bankName'
                name='bankName'
                placeholder='ej: Banco Mercantil'
                error={errors.bankName}
                className="bg-principal-300/40 border-secondary text-secondary placeholder:text-secondary-600 focus-visible:ring-accent"
              />
            )}
          />
        </FormField>

        <FormField label='Código del Banco' error={errors.bankCode} optional>
          <Controller
            control={control}
            name='bankCode'
            render={({ field }) => (
              <Input
                {...field}
                id='bankCode'
                name='bankCode'
                placeholder='ej: 0105'
                error={errors.bankCode}
                className="bg-principal-300/40 border-secondary text-secondary placeholder:text-secondary-600 focus-visible:ring-accent"
              />
            )}
          />
        </FormField>

        <FormField label='Número de Cuenta' error={errors.accountNumber} optional>
          <Controller
            control={control}
            name='accountNumber'
            render={({ field }) => (
              <Input
                {...field}
                id='accountNumber'
                name='accountNumber'
                placeholder='ej: 01051234567890123456'
                error={errors.accountNumber}
                className="bg-principal-300/40 border-secondary text-secondary placeholder:text-secondary-600 focus-visible:ring-accent"
              />
            )}
          />
        </FormField>

        <FormField label='Tipo de Cuenta' error={errors.accountType} optional>
          <Controller
            control={control}
            name='accountType'
            render={({ field }) => (
              <Input
                {...field}
                id='accountType'
                name='accountType'
                placeholder='ej: Corriente, Ahorro'
                error={errors.accountType}
                className="bg-principal-300/40 border-secondary text-secondary placeholder:text-secondary-600 focus-visible:ring-accent"
              />
            )}
          />
        </FormField>

        <FormField label='Correo electrónico' error={errors.email} optional>
          <Controller
            control={control}
            name='email'
            render={({ field }) => (
              <Input
                {...field}
                id='email'
                name='email'
                type='email'
                placeholder='correo@ejemplo.com'
                error={errors.email}
                className="bg-principal-300/40 border-secondary text-secondary placeholder:text-secondary-600 focus-visible:ring-accent"
              />
            )}
          />
        </FormField>

        <FormField
          label='Nombre de contacto'
          error={errors.contactName}
          optional
        >
          <Controller
            control={control}
            name='contactName'
            render={({ field }) => (
              <Input
                {...field}
                id='contactName'
                name='contactName'
                placeholder='Nombre completo'
                error={errors.contactName}
                className="bg-principal-300/40 border-secondary text-secondary placeholder:text-secondary-600 focus-visible:ring-accent"
              />
            )}
          />
        </FormField>

        <FormField label='Teléfono' error={errors.phone} optional>
          <Controller
            control={control}
            name='phone'
            render={({ field }) => (
              <Input
                {...field}
                id='phone'
                name='phone'
                type='tel'
                placeholder='+57 424 1234567'
                error={errors.phone}
                className="bg-principal-300/40 border-secondary text-secondary placeholder:text-secondary-600 focus-visible:ring-accent"
              />
            )}
          />
        </FormField>

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-accent text-white p-2 md:p-2.5 text-sm md:text-base rounded hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <span className='flex items-center justify-center gap-2'>
              <Loader2 className='w-3 h-3 md:w-4 md:h-4 animate-spin' />
              <span>Agregando...</span>
            </span>
          ) : (
            'Agregar Método de Pago'
          )}
        </button>
      </form>
    </div>
  )
}
