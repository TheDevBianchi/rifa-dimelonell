import { Controller } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function DescriptionField({ errors }) {
  return (
    <div>
      <Label htmlFor='description'>Descripción</Label>
      <Controller
        name='description'
        rules={{ required: 'La descripción es requerida' }}
        render={({ field }) => (
          <Textarea
            {...field}
            id='description'
            className='bg-gray-700 min-h-[120px]'
            placeholder='Describe los detalles de la rifa'
          />
        )}
      />
      {errors.description && (
        <p className='text-sm text-red-500 mt-1'>
          {errors.description.message}
        </p>
      )}
    </div>
  )
}
