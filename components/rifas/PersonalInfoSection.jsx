import { Controller } from 'react-hook-form'
import { User, Mail, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'

const PersonalInfoSection = ({ control, errors }) => (
  <div className='space-y-4 bg-principal-200 p-4 rounded-lg border border-principal-400/30 transition-all duration-300 hover:shadow-sm'>
    <h2 className='text-lg font-medium text-secondary flex items-center gap-2'>
      <User className='w-4 h-4 text-secondary' />
      Información Personal
    </h2>

    <div className='space-y-3'>
      {/* Campo Nombre */}
      <div className='space-y-1'>
        <label
          htmlFor='name'
          className='text-sm font-medium text-secondary-700 flex items-center gap-2'>
          <User className='w-3.5 h-3.5 text-secondary-600' />
          Nombre Completo
        </label>
        <Controller
          name='name'
          control={control}
          rules={{ required: 'El nombre es requerido' }}
          render={({ field }) => (
            <Input
              {...field}
              id='name'
              className='bg-principal-100 border-principal-400/30 focus:border-accent/50 transition-colors'
              placeholder='John Doe'
            />
          )}
        />
        {errors.name && (
          <p className='text-red-400 text-sm'>{errors.name.message}</p>
        )}
      </div>

      {/* Campo Email */}
      <div className='space-y-1'>
        <label
          htmlFor='email'
          className='text-sm font-medium text-secondary-700 flex items-center gap-2'>
          <Mail className='w-3.5 h-3.5 text-secondary-600' />
          Correo Electrónico
        </label>
        <Controller
          name='email'
          control={control}
          rules={{
            required: 'El correo es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Correo electrónico inválido',
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              id='email'
              type='email'
              className='bg-principal-100 border-principal-400/30 focus:border-accent/50 transition-colors'
              placeholder='john@example.com'
            />
          )}
        />
        {errors.email && (
          <p className='text-red-400 text-sm'>{errors.email.message}</p>
        )}
      </div>

      {/* Campo Teléfono */}
      <div className='space-y-1'>
        <label
          htmlFor='phone'
          className='text-sm font-medium text-secondary-700 flex items-center gap-2'>
          <Phone className='w-3.5 h-3.5 text-secondary-600' />
          Teléfono
        </label>
        <Controller
          name='phone'
          control={control}
          rules={{ required: 'El teléfono es requerido' }}
          render={({ field }) => (
            <Input
              {...field}
              id='phone'
              type='tel'
              className='bg-principal-100 border-principal-400/30 focus:border-accent/50 transition-colors'
              placeholder='+58 424 1234567'
            />
          )}
        />
        {errors.phone && (
          <p className='text-red-400 text-sm'>{errors.phone.message}</p>
        )}
      </div>
    </div>
  </div>
)

export default PersonalInfoSection
