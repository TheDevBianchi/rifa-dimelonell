import { Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { FormField } from './FormField'
import { User, Mail, Phone } from 'lucide-react'

export function PersonalInfoFields({ form }) {
  const {
    control,
    formState: { errors },
  } = form

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold text-gray-100 mb-4'>
        Información Personal
      </h2>

      <FormField
        label='Nombre y Apellido'
        error={errors.name}
        icon={<User className='w-4 h-4 text-gray-400' />}>
        <Controller
          name='name'
          control={control}
          rules={{
            required: 'El nombre es requerido',
            minLength: {
              value: 3,
              message: 'El nombre debe tener al menos 3 caracteres',
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              type='text'
              className='bg-gray-800/50 border-gray-700'
              placeholder='Tu nombre completo'
              aria-label='Nombre completo'
            />
          )}
        />
      </FormField>

      <FormField
        label='Email'
        error={errors.email}
        icon={<Mail className='w-4 h-4 text-gray-400' />}>
        <Controller
          name='email'
          control={control}
          rules={{
            required: 'El email es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email inválido',
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              type='email'
              className='bg-gray-800/50 border-gray-700'
              placeholder='tu@email.com'
              aria-label='Correo electrónico'
            />
          )}
        />
      </FormField>

      <FormField
        label='Teléfono'
        error={errors.phone}
        icon={<Phone className='w-4 h-4 text-gray-400' />}>
        <Controller
          name='phone'
          control={control}
          rules={{
            required: 'El teléfono es requerido',
            pattern: {
              value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
              message: 'Número de teléfono inválido',
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              type='tel'
              className='bg-gray-800/50 border-gray-700'
              placeholder='+58 424 1234567'
              aria-label='Número de teléfono'
            />
          )}
        />
      </FormField>
    </div>
  )
}
