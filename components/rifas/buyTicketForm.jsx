'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pendingPurchaseSchema } from '@/schema/pendingPurchaseSchema'
import { useState, useEffect } from 'react'
import { useSettingsStore } from '@/store/use-settings-store'
import { useDollarPrice } from '@/hooks/useDollarPrice'
import PersonalInfoSection from './PersonalInfoSection'
import PaymentInfoSection from './PaymentInfoSection'
import TicketSelectionSection from './TicketSelectionSection'
import FloatingTotal from './FloatingTotal'
import SuccessModal from './success-modal'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

// Función para formatear precios en COP
const formatCOP = (price) => {
  return `COP ${price.toLocaleString('es-CO')}`;
}

const BuyTicketForm = ({ raffle, onSubmit }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)
  const [randomTicketCount, setRandomTicketCount] = useState(0)
  const [showAllTickets, setShowAllTickets] = useState(false)
  const [error, setError] = useState(null)
  const { dollarPrice, getDollarPrice } = useDollarPrice()
  
  // Estado para las promociones
  const [promotionData, setPromotionData] = useState({
    selectedPromotion: null,
    regularTotal: 0,
    discountedTotal: 0,
    savings: 0
  })

  const { paymentMethods, getPaymentMethods, loading } = useSettingsStore()

  const form = useForm({
    resolver: zodResolver(pendingPurchaseSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      paymentMethod: '',
      paymentReference: '',
      selectedTickets: [],
    },
  })

  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = form
  const selectedTickets = watch('selectedTickets') || []
  const selectedMethod = watch('paymentMethod')

  useEffect(() => {
    getPaymentMethods()
    getDollarPrice()
  }, [getPaymentMethods, getDollarPrice])

  const handleSubmit = async (data) => {
    setError(null)
    
    try {
      const ticketsRequested = data.selectedTickets.length
      const availableTickets = raffle.totalTickets - 
        (raffle.soldTickets?.length || 0) - 
        (raffle.reservedTickets?.length || 0)

      if (ticketsRequested > availableTickets) {
        throw new Error(`No hay suficientes tickets disponibles. Solo quedan ${availableTickets} tickets.`)
      }
      
      // Agregar información de promoción a los datos enviados
      const dataWithPromotion = {
        ...data,
        promotion: promotionData.selectedPromotion ? {
          id: promotionData.selectedPromotion.id,
          name: promotionData.selectedPromotion.name,
          discountType: promotionData.selectedPromotion.discountType,
          regularTotal: promotionData.regularTotal,
          discountedTotal: promotionData.discountedTotal,
          savings: promotionData.savings
        } : null
      }

      const result = await onSubmit(dataWithPromotion)
      
      if (result) {
        form.reset()
        setRandomTicketCount(0)
        setShowSuccessModal(true)
        setSubmittedData(dataWithPromotion)
      }
    } catch (error) {
      console.error('Error al procesar la compra:', error)
      setError(error.message || 'Ha ocurrido un error al procesar tu compra')
      setShowSuccessModal(false)
      toast.error('Error al procesar la compra', {
        description: error.message || 'Ha ocurrido un error al procesar tu compra',
      })
    }
  }

  const ticketCount = raffle.randomTickets
    ? randomTicketCount
    : selectedTickets.length

  const availableTickets = raffle.totalTickets - (raffle.soldTickets?.length || 0) - (raffle.reservedTickets?.length || 0)

  if (availableTickets === 0) {
    return (
      <div className='p-6 text-center'>
        <div className='bg-accent/10 border border-accent/20 rounded-lg p-6'>
          <h3 className='text-xl font-bold text-accent mb-2'>
            Rifa Agotada
          </h3>
          <p className='text-secondary-700'>
            Lo sentimos, todos los tickets de esta rifa han sido vendidos.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className='space-y-8 p-6 text-secondary'>
      {error && (
        <div className='flex items-start gap-2 p-4 rounded-lg bg-accent/10 border border-accent/20'>
          <AlertCircle className='w-5 h-5 text-accent mt-0.5 flex-shrink-0' />
          <p className='text-sm text-secondary-700'>{error}</p>
        </div>
      )}
      <PersonalInfoSection control={control} errors={errors} />
      <TicketSelectionSection
        raffle={raffle}
        control={control}
        errors={errors}
        randomTicketCount={randomTicketCount}
        setRandomTicketCount={setRandomTicketCount}
        selectedTickets={selectedTickets}
        showAllTickets={showAllTickets}
        setShowAllTickets={setShowAllTickets}
        setValue={setValue}
        dollarPrice={dollarPrice}
        setPromotionData={setPromotionData}
      />
      <PaymentInfoSection
        control={control}
        errors={errors}
        paymentMethods={paymentMethods}
        loading={loading}
        selectedMethod={selectedMethod}
      />
      <FloatingTotal
        ticketCount={ticketCount}
        raffle={raffle}
        isSubmitting={form.formState.isSubmitting}
        minTickets={raffle.minTickets}
        selectedPromotion={promotionData.selectedPromotion}
        regularTotal={promotionData.regularTotal}
        discountedTotal={promotionData.discountedTotal}
        savings={promotionData.savings}
      />
      <SuccessModal
        isOpen={showSuccessModal && !error}
        onClose={() => {
          setShowSuccessModal(false)
          setSubmittedData(null)
        }}
        purchaseData={submittedData}
        raffle={raffle}
      />
    </form>
  )
}

export default BuyTicketForm
