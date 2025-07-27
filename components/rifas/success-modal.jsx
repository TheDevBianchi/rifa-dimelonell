'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSettingsStore } from '@/store/use-settings-store'

const SuccessModal = ({ isOpen, onClose, purchaseData, raffle }) => {
  const paymentMethod = useSettingsStore((state) =>
    state.paymentMethods.find(
      (method) => method.id === purchaseData?.paymentMethod
    )
  )

  if (!purchaseData) return null

  const whatsappMessage = encodeURIComponent(
    `¡Hola! Acabo de reservar ${
      purchaseData?.selectedTickets?.length
    } tickets para la rifa ${raffle?.title}:
    \n\nTotal pagado: ${(
              purchaseData?.selectedTickets?.length * raffle?.price
    ).toLocaleString('es-CO')} COP
    \n\nMétodo de pago: ${paymentMethod?.name}
    \n\nReferencia: ${purchaseData.paymentReference}
    `
  )

  const whatsappUrl = `https://wa.me/573014578611?text=${whatsappMessage}`

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-secondary-900/70 backdrop-blur-sm z-50'
            onClick={onClose}
            aria-hidden='true'
          />

          {/* Modal */}
          <motion.div
            role='dialog'
            aria-labelledby='modal-title'
            aria-modal='true'
            className='fixed left-1/2 top-1/2 z-50 w-full max-w-md'
            initial={{ opacity: 0, y: 100, x: '-50%' }}
            animate={{ opacity: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, y: 100 }}>
            <div className='relative bg-principal-100 rounded-lg p-5 shadow-sm border border-principal-400/30'>
              {/* Close button */}
              <button
                onClick={onClose}
                className='absolute right-3 top-3 text-secondary-600 hover:text-secondary transition-colors'
                aria-label='Cerrar modal'>
                <X className='h-5 w-5' />
              </button>

              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
                className='mx-auto w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mb-4'>
                <Check className='h-7 w-7 text-accent' />
              </motion.div>

              <div className='text-center mb-4'>
                <h2
                  id='modal-title'
                  className='text-lg font-medium text-secondary mb-2'>
                  ¡Reserva Exitosa!
                </h2>
                <p className='text-secondary-700 text-sm'>
                  Tu reserva se ha realizado correctamente, envía tu comprobante
                  de pago a través del botón de WhatsApp.
                </p>
              </div>

              <div className='space-y-3 mb-4'>
                <div className='bg-principal-200/80 p-3 rounded border border-principal-400/30'>
                  <h3 className='font-medium text-secondary text-sm mb-2'>
                    Detalles de la compra:
                  </h3>
                  <ul className='space-y-1.5 text-secondary-700 text-sm'>
                    {!raffle.randomTickets ? (
                      <li>
                        <span className="text-secondary">Tickets:</span> {purchaseData.selectedTickets.join(', ')}
                      </li>
                    ) : (
                      <li>Sus tickets serán enviados por correo</li>
                    )}
                    <li>
                      <span className="text-secondary">Total:</span> {(
                        purchaseData.selectedTickets.length * raffle.price
                      ).toLocaleString('es-CO')}{' '}
                      COP
                    </li>
                    <li><span className="text-secondary">Método de pago:</span> {paymentMethod?.name}</li>
                    <li><span className="text-secondary">Referencia:</span> {purchaseData.paymentReference}</li>
                  </ul>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-2'>
                <a
                  href={whatsappUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={cn(
                    'flex-1 px-4 py-2 bg-accent text-white rounded',
                    'hover:bg-accent/90 transition-colors',
                    'focus:outline-none focus:ring-1 focus:ring-accent/50',
                    'font-medium text-sm text-center'
                  )}>
                  Contactar por WhatsApp
                </a>
                <button
                  onClick={onClose}
                  className={cn(
                    'flex-1 px-4 py-2 bg-principal-300 text-secondary rounded',
                    'hover:bg-principal-400 transition-colors',
                    'focus:outline-none focus:ring-1 focus:ring-principal-400/50',
                    'font-medium text-sm'
                  )}>
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SuccessModal
