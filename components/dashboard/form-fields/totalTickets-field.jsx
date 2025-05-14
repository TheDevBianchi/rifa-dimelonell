import { Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function TotalTicketsField({ errors }) {
  return (
    <div>
      <Label htmlFor='totalTickets'>Total de Tickets</Label>
      <Controller
        name='totalTickets'
        rules={{
          required: 'El total de tickets es requerido',
          min: { value: 0, message: 'El total de tickets debe ser mayor a 0' },
        }}
        render={({ field }) => (
          <Input
            {...field}
            id='totalTickets'
            type='number'
            step='1'
            className='bg-gray-700'
            placeholder={`${raffle.totalTickets}`}
            value={raffle.totalTickets}
          />
        )}
      />
      {errors.totalTickets && (
        <p className='text-sm text-red-500 mt-1'>
          {errors.totalTickets.message}
        </p>
      )}
    </div>
  )
}
