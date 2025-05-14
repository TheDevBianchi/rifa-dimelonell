import { Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form'
import { Ticket, Shuffle, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { validateTicketAvailability } from '@/utils/ticketValidations'

export function TicketSelection ({
  form,
  raffle,
  randomTicketCount,
  setRandomTicketCount
}) {
  const { control, setValue, watch } = form
  const selectedTickets = watch('selectedTickets') || []
  const [showAllTickets, setShowAllTickets] = useState(false)
  const [error, setError] = useState('')

  // Si la rifa es de tickets aleatorios, solo mostrar el selector de cantidad
  if (raffle.randomTickets) {
    const handleTicketCountChange = (value) => {
      try {
        validateTicketAvailability(raffle, value)
        setError('')
        setRandomTicketCount(value)
        setValue('selectedTickets', Array(value).fill(''), {
          shouldValidate: true
        })
      } catch (err) {
        setError(err.message)
        setRandomTicketCount(0)
        setValue('selectedTickets', [], {
          shouldValidate: true
        })
      }
    }

    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-gray-100'>
            Selección de Tickets
          </h2>
          <span className='text-sm text-gray-400'>
            Disponibles: {raffle.totalTickets - (raffle.soldTickets?.length || 0) - (raffle.reservedTickets?.length || 0)}
          </span>
        </div>

        <FormField
          label='Cantidad de tickets'
          icon={<Ticket className='w-4 h-4 text-gray-400' />}
        >
          <Input
            type='number'
            min={1}
            max={raffle.totalTickets - (raffle.soldTickets?.length || 0) - (raffle.reservedTickets?.length || 0)}
            value={randomTicketCount}
            onChange={e => handleTicketCountChange(Number(e.target.value))}
            className='bg-gray-800/50 border-gray-700'
            placeholder={`1-${raffle.minTickets} tickets`}
          />
        </FormField>

        {error && (
          <div className='flex items-start gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20'>
            <AlertCircle className='w-5 h-5 text-red-400 mt-0.5 flex-shrink-0' />
            <p className='text-sm text-red-300'>{error}</p>
          </div>
        )}
      </div>
    )
  }

  // Si no es aleatoria, mostrar el grid de selección manual
  const availableTickets = Array.from({ length: raffle.totalTickets }, (_, i) =>
    (i + 1).toString().padStart(3, '0')
  ).filter(
    number =>
      !raffle.soldTickets?.includes(number) &&
      !raffle.reservedTickets?.includes(number)
  )

  const handleTicketClick = number => {
    const currentSelected = form.getValues('selectedTickets') || []
    let newSelected

    if (currentSelected.includes(number)) {
      newSelected = currentSelected.filter(t => t !== number)
    } else {
      if (currentSelected.length >= raffle.minTickets) {
        return // No permitir seleccionar más del máximo
      }
      newSelected = [...currentSelected, number]
    }

    setValue('selectedTickets', newSelected, { shouldValidate: true })
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-100'>
          Selección de Tickets
        </h2>
        <span className='text-sm text-gray-400'>
          Mínimo: {raffle.minTickets} tickets
        </span>
      </div>

      {/* Grid de tickets */}
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <Ticket className='w-4 h-4 text-gray-400' />
            <span className='text-sm font-medium text-gray-200'>
              Tickets Disponibles
            </span>
          </div>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => setShowAllTickets(!showAllTickets)}
          >
            {showAllTickets ? 'Mostrar Menos' : 'Mostrar Todos'}
          </Button>
        </div>

        <div className='grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-[300px] overflow-y-auto p-2'>
          {availableTickets
            .slice(0, showAllTickets ? undefined : 40)
            .map(number => (
              <button
                key={number}
                type='button'
                onClick={() => handleTicketClick(number)}
                className={cn(
                  'p-2 text-sm rounded-md transition-colors',
                  'hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary',
                  selectedTickets.includes(number)
                    ? 'bg-primary text-white'
                    : 'bg-gray-800/50 text-white'
                )}
              >
                {number}
              </button>
            ))}
        </div>

        {!showAllTickets && availableTickets.length > 40 && (
          <p className='text-center text-sm text-gray-400'>
            Mostrando 40 de {availableTickets.length} tickets disponibles
          </p>
        )}
      </div>

      {/* Tickets seleccionados */}
      <div className='space-y-2'>
        <h3 className='text-sm font-medium text-gray-200'>
          Tickets Seleccionados ({selectedTickets.length}/{raffle.minTickets})
        </h3>
        <div className='flex flex-wrap gap-2'>
          {selectedTickets.map(number => (
            <span
              key={number}
              className='px-3 py-1 bg-primary/20 text-primary rounded-full text-sm'
            >
              {number}
            </span>
          ))}
        </div>
      </div>

      {/* Información de validación */}
      {selectedTickets.length > 0 &&
        selectedTickets.length < raffle.minTickets && (
          <div className='flex items-start gap-2 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20'>
            <AlertCircle className='w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0' />
            <p className='text-sm text-yellow-300'>
              Debes seleccionar al menos {raffle.minTickets} tickets para
              continuar
            </p>
          </div>
        )}

      <Controller
        name='selectedTickets'
        control={control}
        rules={{
          validate: value =>
            value?.length >= raffle.minTickets ||
            `Debes seleccionar al menos ${raffle.minTickets} tickets`
        }}
        render={({ field }) => <input type='hidden' {...field} />}
      />
    </div>
  )
}
