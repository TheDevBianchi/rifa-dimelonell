import { Controller } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Calendar } from 'lucide-react'
import DatePicker from 'react-datepicker'

export function DateField () {
  return (
    <div>
      <Label htmlFor='endDate'>Fecha de finalización</Label>
      <Controller
        name='endDate'
        render={({ field }) => (
          <div className='relative'>
            <DatePicker
              selected={field.value}
              onChange={field.onChange}
              showTimeSelect
              dateFormat='Pp'
              className='w-full bg-gray-700 text-white rounded-md px-3 py-2 pl-10'
              placeholderText='Selecciona fecha y hora'
            />
            <Calendar className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
          </div>
        )}
      />
    </div>
  )
}
