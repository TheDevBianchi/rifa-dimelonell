'use client'

import { memo, useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { getRaffles } from '@/app/dashboard/compras/actions'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ConfirmDialog } from './ConfirmDialog'
import { createDirectPurchase } from '@/app/dashboard/compras/actions'
import { EmailSender } from '@/components/purchases/EmailSender'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const formSchema = z.object({
  raffleId: z.string().min(1, 'Seleccione una rifa'),
  name: z.string().min(1, 'Nombre completo es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\d+$/, 'Solo números permitidos'),
  ticketCount: z.number()
    .min(1, 'Mínimo 1 ticket'),
  notify: z.boolean().default(true),
  manualTickets: z.boolean().default(false),
  selectedTickets: z.array(z.number()).optional()
})

export const CreatePurchaseModal = memo(({ open, onOpenChange, onPurchaseCreated }) => {
  const [raffles, setRaffles] = useState([])
  const [isLoadingRaffles, setIsLoadingRaffles] = useState(true)
  const [selectedRaffleId, setSelectedRaffleId] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [formData, setFormData] = useState(null)
  const [emailData, setEmailData] = useState(null)
  const [isManualMode, setIsManualMode] = useState(false)
  const [manualTickets, setManualTickets] = useState([])
  const [manualTicketsInput, setManualTicketsInput] = useState('')

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notify: false,
      ticketCount: 1,
      manualTickets: false,
      selectedTickets: []
    }
  })

  const loadRaffles = useCallback(async () => {
    try {
      setIsLoadingRaffles(true)
      const result = await getRaffles()
      if (result.success) {
        setRaffles(result.raffles)
      }
    } catch (error) {
      toast.error('Error al cargar las rifas')
    } finally {
      setIsLoadingRaffles(false)
    }
  }, [])

  useEffect(() => {
    loadRaffles()
  }, [loadRaffles])

  const selectedRaffle = raffles.find(raffle => raffle.id === selectedRaffleId)
  const maxAvailableTickets = selectedRaffle?.availableTickets || 0

  const handleRaffleChange = useCallback((value) => {
    setSelectedRaffleId(value)
    form.setValue('raffleId', value)
  }, [form])

  const handleSubmit = async (data) => {
    if (isManualMode && manualTickets.length === 0) {
      toast.error('Debes seleccionar al menos un ticket en modo manual')
      return
    }

    if (!data.notify) {
      setFormData(data)
      setShowConfirmDialog(true)
      return
    }
    await processPurchase(data)
  }

  const processPurchase = async (data) => {
    try {
      const purchaseData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        ticketCount: data.ticketCount,
        notify: data.notify,
        selectedTickets: isManualMode ? manualTickets : undefined
      }

      const result = await createDirectPurchase(data.raffleId, purchaseData)

      if (result.success) {
        if (data.notify) {
          try {
            const emailParams = {
              email: data.email,
              name: data.name,
              amount: String((result.selectedTickets.length * selectedRaffle.price).toFixed(2)),
              date: new Date().toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'America/Caracas'
              }) + ' UTC-4',
              paymentMethod: "Compra Directa",
              raffleName: selectedRaffle.title,
              ticketsCount: String(result.selectedTickets.length),
              confirmationNumber: "CD-" + new Date().getTime(),
              number: result.selectedTickets.join(', ')
            }

            console.log('Enviando correo con parámetros:', emailParams)

            const emailResponse = await fetch('/api/email/send-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(emailParams)
            })

            if (!emailResponse.ok) {
              throw new Error('Error al enviar el correo')
            }

            console.log('Respuesta del envío de correo:', emailResponse)
            toast.success('Correo enviado exitosamente')
          } catch (emailError) {
            console.error('Error al enviar el correo:', emailError)
            toast.error('La compra se realizó pero hubo un error al enviar el correo')
          }
        }

        setManualTickets([])
        setManualTicketsInput('')
        setIsManualMode(false)
        toast.success(result.message)
        onOpenChange(false)
        form.reset()
        onPurchaseCreated()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.error('Error completo:', error)
      toast.error(`Error: ${error.message}`)
    }
  }

  const handleConfirmPurchase = () => {
    setShowConfirmDialog(false)
    if (formData) {
      processPurchase(formData)
    }
  }

  const handleManualTicketChange = (e) => {
    const value = e.target.value
    setManualTicketsInput(value)

    if (value.trim()) {
      const tickets = value
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== '')
        .map(t => parseInt(t))
        .filter(t => !isNaN(t))
      
      setManualTickets(tickets)
      form.setValue('ticketCount', tickets.length)
    } else {
      setManualTickets([])
      form.setValue('ticketCount', 0)
    }
  }

  const handleModeChange = (checked) => {
    setIsManualMode(checked)
    setManualTickets([])
    setManualTicketsInput('')
    form.setValue('ticketCount', 1)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[480px] max-h-[90vh] bg-principal-200 border border-black">
          <DialogHeader>
            <DialogTitle className="text-black">Nueva Compra</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] pr-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="raffleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rifa</FormLabel>
                      <Select 
                        onValueChange={handleRaffleChange}
                        value={selectedRaffleId}
                        disabled={isLoadingRaffles}
                      >
                        <FormControl>
                          <SelectTrigger className='text-black bg-principal-300/40 border-black focus:border-accent'>
                            <SelectValue placeholder="Seleccionar rifa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='bg-principal-200 border border-black'>
                          {raffles.map(raffle => (
                            <SelectItem 
                              key={raffle.id} 
                              value={raffle.id}
                            >
                              {raffle.title} - {raffle.availableTickets} tickets disponibles
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: Juan Pérez" 
                          {...field}
                          aria-label="Nombre completo del comprador"
                          className="bg-principal-300/40 border-black focus:border-accent text-black"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="correo@ejemplo.com" 
                          {...field}
                          aria-label="Correo electrónico del comprador"
                          className="bg-principal-300/40 border-black focus:border-accent text-black"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="1234567890" 
                          {...field}
                          aria-label="Número de teléfono del comprador"
                          className="bg-principal-300/40 border-black focus:border-accent text-black"
                        />
                      </FormControl>
                      <FormDescription>
                        Solo números, sin espacios ni caracteres especiales
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between space-x-2 p-4 border border-black rounded-md bg-principal-300/40">
                  <div className="space-y-0.5">
                    <Label htmlFor="manual-mode">Modo Manual</Label>
                    <FormDescription>
                      Permite seleccionar números específicos
                    </FormDescription>
                  </div>
                  <Switch
                    id="manual-mode"
                    checked={isManualMode}
                    onCheckedChange={handleModeChange}
                  />
                </div>

                {isManualMode ? (
                  <FormField
                    control={form.control}
                    name="selectedTickets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Números Seleccionados</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: 1,2,3,4,5"
                            onChange={handleManualTicketChange}
                            value={manualTicketsInput}
                            aria-label="Números de tickets separados por comas"
                            className="bg-principal-300/40 border-black focus:border-accent text-black"
                          />
                        </FormControl>
                        <FormDescription>
                          Ingresa los números separados por comas
                        </FormDescription>
                        {manualTickets.length > 0 && (
                          <FormDescription className="mt-2 text-accent">
                            Tickets seleccionados: {manualTickets.length} ({manualTickets.join(', ')})
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="ticketCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantidad de Tickets</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1}
                            max={maxAvailableTickets}
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                            aria-label="Cantidad de tickets a comprar"
                            className="bg-principal-300/40 border-black focus:border-accent text-black"
                          />
                        </FormControl>
                        <FormDescription>
                          Máximo disponible: {maxAvailableTickets} tickets
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="notify"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-black p-4 bg-principal-300/40">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label="Notificar al usuario por email"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Notificar al usuario
                        </FormLabel>
                        <FormDescription>
                          Se enviará un correo electrónico con los detalles de la compra
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <div className="mt-4">
              <Button 
                type="submit" 
                className="w-full bg-accent text-black hover:bg-accent/90"
                disabled={isLoadingRaffles || form.formState.isSubmitting || (isManualMode && manualTickets.length === 0)}
                onClick={form.handleSubmit(handleSubmit)}
              >
                {form.formState.isSubmitting ? 'Creando...' : 'Crear Compra'}
              </Button>
            </div>
          </ScrollArea>

        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmPurchase}
        onCancel={() => setShowConfirmDialog(false)}
      />

      {emailData && <EmailSender emailData={emailData} />}
    </>
  )
})

CreatePurchaseModal.displayName = 'CreatePurchaseModal' 