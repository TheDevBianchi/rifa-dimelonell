import { Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function TitleField({ control, errors }) {
  return (
    <div>
      <Label htmlFor='title'>Título</Label>
      <Controller
        control={control}
        name='title'
        rules={{ required: 'El título es requerido' }}
        render={({ field }) => (
          <Input
            {...field}
            id='title'
            className='bg-gray-700'
            placeholder='Nombre de la rifa'
            error={errors.title?.message}
          />
        )}
      />
      {errors.title && (
        <p className='text-sm text-red-500 mt-1'>{errors.title.message}</p>
      )}
    </div>
  )
}
