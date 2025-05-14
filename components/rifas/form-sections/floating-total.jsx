import { DollarSign, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function FloatingTotal ({ raffle, randomTicketCount, isSubmitting }) {
  const total = raffle.randomTickets
    ? randomTicketCount * raffle.price
    : selectedTickets.length * raffle.price

  const ticketCount = raffle.randomTickets
    ? randomTicketCount
    : selectedTickets.length

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className='fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 p-4 z-50'
    >
      <div className='container mx-auto max-w-2xl flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <DollarSign className='w-5 h-5 text-green-400' />
            <span className='text-lg font-semibold text-green-400'>
              ${total.toFixed(2)} USD
            </span>
          </div>
          <span className='text-sm text-gray-400'>
            ({ticketCount} tickets × ${raffle.price} USD)
          </span>
        </div>

        <Button
          type='submit'
          disabled={isSubmitting || ticketCount < raffle.minTickets}
          className='bg-primary hover:bg-primary/90 text-white min-w-[150px]'
        >
          {isSubmitting ? (
            <div className='flex items-center gap-2'>
              <Loader2 className='w-4 h-4 animate-spin' />
              <span>Procesando...</span>
            </div>
          ) : (
            <span>Comprar Tickets</span>
          )}
        </Button>
      </div>

      {ticketCount > 0 && ticketCount < raffle.minTickets && (
        <p className='text-center text-sm text-yellow-400 mt-2'>
          Debes seleccionar al menos {raffle.minTickets} tickets para continuar
        </p>
      )}
    </motion.div>
  )
}
