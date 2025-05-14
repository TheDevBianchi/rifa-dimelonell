import { motion } from 'framer-motion'
import { Tag, Percent, ArrowDownCircle, Package } from 'lucide-react'

const FloatingTotal = ({ 
  ticketCount,  
  isSubmitting, 
  minTickets,
  selectedPromotion,
  regularTotal,
  discountedTotal,
  savings
}) => {

  return (
    <motion.div
      className='bg-principal-200 p-4 rounded-lg border border-principal-400/30 transition-all duration-300 hover:shadow-sm'
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className='flex flex-col space-y-4'>
        {/* Promoción aplicada */}
        {selectedPromotion && (
          <div className='flex items-center justify-between bg-principal-300/30 p-2 rounded-md border border-accent/20'>
            <div className='flex items-center gap-1'>
              <Tag className='w-3.5 h-3.5 text-accent' />
              <span className='text-xs font-medium text-secondary-700'>Promoción:</span>
              <span className='text-xs font-medium text-secondary'>{selectedPromotion.name}</span>
            </div>
            <div className='flex items-center gap-1'>
              {selectedPromotion.discountType === 'percentage' && (
                <Percent className='w-3.5 h-3.5 text-accent' />
              )}
              {selectedPromotion.discountType === 'lower_cost' && (
                <ArrowDownCircle className='w-3.5 h-3.5 text-accent' />
              )}
              {selectedPromotion.discountType === 'package' && (
                <Package className='w-3.5 h-3.5 text-accent' />
              )}
            </div>
          </div>
        )}
        
        {/* Detalles del precio */}
        <div className='flex justify-between items-center'>
          <div className='space-y-1'>
            {selectedPromotion && (
              <div className='flex items-center'>
                <span className='text-xs text-secondary-600 line-through mr-2'>{(regularTotal * 4000).toLocaleString('es-CO')} COP</span>
                <span className='text-xs bg-principal-400/30 text-accent px-2 py-0.5 rounded-full'>
                  Ahorras {(savings * 4000).toLocaleString('es-CO')} COP
                </span>
              </div>
            )}
            <div className='flex items-center'>
              <span className='text-xs font-medium text-secondary-700 mr-2'>Total:</span>
              <span className='text-base font-medium text-secondary'>
                {(discountedTotal * 4000).toLocaleString('es-CO')} COP
              </span>
            </div>
          </div>
          
          <div className='flex items-center space-x-2'>
            <button
              type='submit'
              disabled={isSubmitting || ticketCount < minTickets}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                isSubmitting || ticketCount < minTickets
                  ? 'bg-secondary-400 text-white cursor-not-allowed'
                  : 'bg-accent text-white hover:bg-accent/90'
              }`}
            >
              {isSubmitting ? 'Procesando...' : 'Comprar'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default FloatingTotal
