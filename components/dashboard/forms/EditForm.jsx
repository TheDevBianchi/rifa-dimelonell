'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRaffles } from '@/hooks/useRaffles'
import {
  Save,
  Loader2,
  DollarSign,
  Calendar,
  Hash,
  FileText,
  ImageIcon
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { cn } from '@/lib/utils'
import ImageUploadField from '../form-fields/imageSelector'

const formSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.string().min(1, 'El precio es requerido'),
  totalTickets: z.string().min(1, 'El total de tickets es requerido'),
  minTickets: z.string().min(1, 'El mínimo de tickets es requerido'),
  endDate: z.date(),
  images: z.string().optional(),
  randomTickets: z.boolean().default(false)
})

const FormSection = ({ title, icon: Icon, children }) => (
  <div className='space-y-6'>
    <h3 className='text-lg font-semibold text-secondary flex items-center gap-2'>
      <Icon className='w-5 h-5' />
      {title}
    </h3>
    {children}
  </div>
)

const InputField = ({ label, error, children }) => (
  <div className='space-y-2'>
    <label className='text-sm font-medium text-secondary-600'>{label}</label>
    {children}
    {error && <p className='text-sm text-red-500'>{error.message}</p>}
  </div>
)

export default function EditRaffleForm ({ raffle }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { updateRaffle } = useRaffles()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: raffle?.title || '',
      description: raffle?.description || '',
      price: raffle?.price?.toString() || '',
      totalTickets: raffle?.totalTickets?.toString() || '',
      minTickets: raffle?.minTickets?.toString() || '',
      endDate: raffle?.endDate ? new Date(raffle.endDate) : new Date(),
      images: raffle?.images?.join('\n') || '',
      randomTickets: raffle?.randomTickets || false
    }
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = form

  const onSubmit = async data => {
    try {
      setIsSubmitting(true)

      const updatedRaffle = {
        ...raffle,
        title: data.title.trim(),
        description: data.description.trim(),
        price: parseFloat(data.price),
        totalTickets: parseInt(data.totalTickets),
        minTickets: parseInt(data.minTickets),
        endDate: data.endDate.toISOString(),
        images: data.images.split('\n').filter(url => url.trim()),
        randomTickets: data.randomTickets,
        updatedAt: new Date().toISOString()
      }

      await updateRaffle(raffle.id, updatedRaffle)
      toast.success('¡Rifa actualizada exitosamente!', {
        description: 'Los cambios se han guardado correctamente'
      })
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar la rifa', {
        description: error.message || 'Ocurrió un error inesperado'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className='bg-principal-200 backdrop-blur-xl border border-secondary shadow-md'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold text-secondary'>
          Editar Rifa
        </CardTitle>
        <CardDescription className='text-secondary-600'>
          Actualiza los detalles de tu rifa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
          <div className='grid gap-8 md:grid-cols-2'>
            {/* Información Principal */}
            <div className='space-y-6 bg-principal-300/40 p-6 rounded-xl border border-secondary hover:border-accent transition-all duration-300'>
              <h3 className='text-xl font-bold text-secondary flex items-center gap-2'>
                <FileText className='w-5 h-5 text-secondary' />
                Información Principal
              </h3>
              <InputField label='Título' error={errors.title}>
                <Controller
                  name='title'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder='Ej: Gran Rifa Benéfica 2024'
                      className='bg-principal-300/40 border-secondary focus:border-accent transition-colors'
                    />
                  )}
                />
              </InputField>

              <InputField label='Descripción' error={errors.description}>
                <Controller
                  name='description'
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder='Describe los detalles y premios de la rifa...'
                      className='bg-principal-300/40 border-secondary focus:border-accent transition-colors min-h-[120px] text-secondary-700 whitespace-pre-line'
                    />
                  )}
                />
              </InputField>
            </div>

            {/* Configuración de Tickets */}
            <FormSection title='Configuración de Tickets' icon={Hash}>
              <div className='grid grid-cols-2 gap-4'>
                <InputField label='Precio (COP)' error={errors.price}>
                  <div className='relative'>
                    <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 text-secondary-600 w-4 h-4' />
                    <Controller
                      name='price'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type='number'
                          step='0.01'
                          min='0'
                          placeholder='0.00'
                          className='bg-principal-300/40 border-secondary focus:border-accent transition-colors pl-10'
                        />
                      )}
                    />
                  </div>
                </InputField>

                <InputField label='Total Tickets' error={errors.totalTickets}>
                  <Controller
                    name='totalTickets'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='number'
                        min='1'
                        placeholder='100'
                        className='bg-principal-300/40 border-secondary focus:border-accent transition-colors'
                      />
                    )}
                  />
                </InputField>
              </div>

              <InputField label='Fecha de Finalización' error={errors.endDate}>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 text-secondary-600 w-4 h-4 z-10' />
                  <Controller
                    name='endDate'
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={date => field.onChange(date)}
                        showTimeSelect
                        timeFormat='HH:mm'
                        timeIntervals={15}
                        dateFormat='dd/MM/yyyy HH:mm'
                        className='w-full pl-10 bg-principal-300/40 border-secondary rounded-lg px-4 py-2.5 text-sm text-secondary'
                        minDate={new Date()}
                      />
                    )}
                  />
                </div>
              </InputField>
            </FormSection>

            {/* Imágenes */}
            <FormSection title='Imágenes' icon={ImageIcon}>
              <InputField label='Imágenes de la Rifa' error={errors.images}>
                <Controller
                  name='images'
                  control={control}
                  render={({ field }) => <ImageUploadField field={field} />}
                />
              </InputField>
            </FormSection>
          </div>

          <div className='flex justify-end pt-6'>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='min-w-[200px] bg-accent text-white hover:bg-accent/90'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className='mr-2 h-4 w-4' />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
