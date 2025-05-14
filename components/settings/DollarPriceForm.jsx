// components/settings/DollarPriceForm.jsx
'use client'
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDollarPrice } from '@/hooks/useDollarPrice'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function DollarPriceForm () {
  const { dollarPrice, getDollarPrice, updateDollarPrice } = useDollarPrice()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      price: dollarPrice
    }
  })

  useEffect(() => {
    getDollarPrice()
  }, [getDollarPrice])

  useEffect(() => {
    reset({ price: dollarPrice })
  }, [dollarPrice, reset])

  const onSubmit = async data => {
    try {
      await updateDollarPrice(parseFloat(data.price))
      toast.success('Precio del dólar actualizado exitosamente')
    } catch (error) {
      toast.error('Error al actualizar el precio del dólar')
    }
  }

  return (
    <div className='bg-gray-800 p-4 md:p-6 rounded-lg'>
      <h2 className='text-lg md:text-xl font-semibold mb-3 md:mb-4'>
        Ajustar Precio del Dólar
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='space-y-2'>
          <label htmlFor='price' className='text-sm font-medium text-gray-200'>
            Precio del Dólar (USD)
          </label>
          <Controller
            name='price'
            control={control}
            rules={{ required: 'El precio es requerido' }}
            render={({ field }) => (
              <Input
                {...field}
                id='price'
                type='number'
                step='0.01'
                className='bg-black/50 border-gray-700/50 focus:border-secondary/50 transition-colors'
                placeholder='0.00'
              />
            )}
          />
          {errors.price && (
            <p className='text-red-400 text-sm'>{errors.price.message}</p>
          )}
        </div>
        <Button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-primary text-white p-2 md:p-2.5 text-sm md:text-base rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSubmitting ? (
            <span className='flex items-center justify-center gap-2'>
              <Loader2 className='w-3 h-3 md:w-4 md:h-4 animate-spin' />
              <span>Actualizando...</span>
            </span>
          ) : (
            'Actualizar Precio'
          )}
        </Button>
      </form>
    </div>
  )
}
