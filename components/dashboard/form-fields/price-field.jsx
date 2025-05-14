import { Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function PriceField({ errors }) {
  return (
    <div>
      <Label htmlFor='price'>Precio</Label>
      <Controller
        name='price'
        rules={{
          required: 'El precio es requerido',
          min: { value: 0, message: 'El precio debe ser mayor a 0' },
        }}
        render={({ field }) => (
          <Input
            {...field}
            id='price'
            type='number'
            step='0.01'
            className='bg-gray-700'
            placeholder='0.00'
          />
        )}
      />
      {errors.price && (
        <p className='text-sm text-red-500 mt-1'>{errors.price.message}</p>
      )}
    </div>
  )
}
