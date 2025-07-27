import { Controller } from 'react-hook-form'
import { Ticket, AlertCircle, DollarSign, Tag, Percent, Package, ArrowDownCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePromotion } from '@/hooks/usePromotion'
import { useEffect, useState } from 'react'

const TicketSelectionSection = ({
  raffle,
  control,
  errors,
  randomTicketCount,
  setRandomTicketCount,
  selectedTickets,
  showAllTickets,
  setShowAllTickets,
  setValue,
  dollarPrice,
  setPromotionData, // Función para enviar datos de promoción al componente padre
}) => {
  // Usar el hook de promociones
  const {
    promotions,
    loading: loadingPromotions,
    selectedPromotion,
    setSelectedPromotion,
    calculateTotal,
    getApplicablePromotions,
    getBestPromotion,
    calculateSavings
  } = usePromotion(raffle.id, raffle.price);
  
  // Estado para mostrar el badge de mejor oferta
  const [bestPromoId, setBestPromoId] = useState(null);
  const availableTickets = Array.from(
    { length: raffle.totalTickets },
    (_, i) => {
      const number = i + 1
      if (raffle.totalTickets <= 100) {
        return number.toString().padStart(2, '0')
      } else if (raffle.totalTickets <= 1000) {
        return number.toString().padStart(3, '0')
      } else {
        return number.toString().padStart(4, '0')
      }
    }
  )

  const handleTicketClick = (number) => {
    const updatedTickets = selectedTickets.includes(number)
      ? selectedTickets.filter((t) => t !== number)
      : [...selectedTickets, number]
    setValue('selectedTickets', updatedTickets, { shouldValidate: true })
  }
  
  // Actualizar la promoción cuando cambia la cantidad de tickets
  useEffect(() => {
    const ticketCount = raffle.randomTickets ? randomTicketCount : selectedTickets.length;
    
    // Obtener la mejor promoción (solo para mostrar el badge)
    const bestPromo = getBestPromotion(ticketCount);
    setBestPromoId(bestPromo.promotion?.id || null);
    
    // Calcular precios y enviar al componente padre
    const regularTotal = ticketCount * raffle.price;
    const discountedTotal = selectedPromotion ? calculateTotal(ticketCount) : regularTotal;
    const savings = selectedPromotion ? calculateSavings(ticketCount) : 0;
    
    setPromotionData({
      selectedPromotion,
      regularTotal,
      discountedTotal,
      savings
    });
  }, [raffle.randomTickets, randomTicketCount, selectedTickets.length, getBestPromotion, calculateTotal, calculateSavings, setPromotionData, selectedPromotion, raffle.price]);
  
  // Función para manejar la selección de promociones
  const handleSelectPromotion = (promo) => {
    // Si ya está seleccionada, deseleccionar
    if (selectedPromotion?.id === promo.id) {
      setSelectedPromotion(null);
    } else {
      setSelectedPromotion(promo);
    }
  };

  return (
    <div className='space-y-4 bg-principal-200 p-4 mb-6 rounded-lg border border-principal-400/30 transition-all duration-300 hover:shadow-sm'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-medium text-secondary flex items-center gap-2'>
          <Ticket className='w-4 h-4 text-accent' />
          Selección de Tickets
        </h2>
        <span className='text-sm text-secondary-600'>
          Mínimo: {raffle.minTickets} tickets
        </span>
      </div>

      {raffle.randomTickets ? (
        <div className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-secondary-700 flex items-center gap-2'>
              <Ticket className='w-3.5 h-3.5 text-secondary-600' />
              Cantidad de tickets
            </label>
            <Input
              type='number'
              min={1}
              value={randomTicketCount || ''}
              onChange={(e) => {
                const value = Number(e.target.value)
                if (value >= 0) {
                  setRandomTicketCount(value)
                  setValue('selectedTickets', Array(value).fill(''), {
                    shouldValidate: true,
                  })
                }
              }}
              className='bg-principal-100 border-principal-400/30 focus:border-accent/50 transition-colors'
              placeholder={`Mínimo ${raffle.minTickets} tickets`}
            />
          </div>

          {/* Total */}
          <div className='flex items-center justify-between py-3 border-t border-principal-400/30'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium text-secondary-700'>Total:</span>
            </div>
            <div className='flex items-center gap-2'>
              {selectedPromotion ? (
                <div className='flex flex-col items-end'>
                  <div className='flex items-center'>
                    <span className='text-xs text-secondary-600 line-through mr-2'>
                      {(randomTicketCount * raffle.price).toLocaleString('es-CO')} COP
                    </span>
                    <span className='text-xs bg-principal-400/30 text-accent px-2 py-0.5 rounded-full'>
                      {selectedPromotion.name}
                    </span>
                  </div>
                  <span className='text-base font-medium text-secondary'>
                    {(calculateTotal(randomTicketCount)).toLocaleString('es-CO')} COP
                  </span>
                </div>
              ) : (
                <span className='text-base font-medium text-secondary'>
                  {(randomTicketCount * raffle.price).toLocaleString('es-CO')} COP
                </span>
              )}
            </div>
          </div>
          
          {/* Mostrar promociones disponibles */}
          {promotions.length > 0 && (
            <div className='mt-3 pt-3 border-t border-principal-400/30'>
              <div className='flex justify-between items-center mb-2'>
                <h3 className='text-sm font-medium text-secondary-700 flex items-center gap-2'>
                  <Tag className='w-3.5 h-3.5 text-accent' />
                  Promociones Disponibles
                </h3>
                {selectedPromotion ? (
                  <button 
                    type="button" 
                    className="text-xs text-secondary-600 hover:text-accent underline"
                    onClick={() => setSelectedPromotion(null)}
                  >
                    Quitar promoción
                  </button>
                ) : (
                  <span className="text-xs text-secondary-600 italic">Haz clic para seleccionar</span>
                )}
              </div>
              <div className="bg-principal-300/20 border border-principal-400/30 rounded-md p-2 mb-2">
                <p className="text-xs text-secondary-700">
                  <span className="font-medium">Nota:</span> Solo puedes aplicar una promoción a la vez.
                </p>
              </div>
              <div className='space-y-2'>
                {promotions.map((promo) => (
                  <div 
                    key={promo.id}
                    className={cn(
                      'p-2 rounded-md border transition-all cursor-pointer',
                      selectedPromotion?.id === promo.id
                        ? 'bg-principal-300/30 border-accent/30 shadow-sm'
                        : 'bg-principal-100 border-principal-400/30 hover:border-principal-500/40'
                    )}
                    onClick={() => handleSelectPromotion(promo)}
                  >
                    <div className='flex justify-between items-center'>
                      <span className='font-medium text-secondary'>{promo.name}</span>
                      <div className="flex items-center gap-1">
                        {bestPromoId === promo.id && (
                          <span className='text-xs bg-principal-400/30 text-accent px-2 py-0.5 rounded-full'>
                            Mejor oferta
                          </span>
                        )}
                        {selectedPromotion?.id === promo.id && (
                          <span className='text-xs bg-principal-400/30 text-accent px-2 py-0.5 rounded-full'>
                            Aplicada
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='text-xs text-secondary-700 mt-1 flex items-center'>
                      {promo.discountType === 'percentage' && (
                        <>
                          <Percent className='w-3 h-3 mr-1 text-accent' />
                          <span>{promo.discountValue}% de descuento</span>
                        </>
                      )}
                      {promo.discountType === 'lower_cost' && (
                        <>
                          <ArrowDownCircle className='w-3 h-3 mr-1 text-accent' />
                          <span>Precio reducido: {(promo.newTicketPrice).toLocaleString('es-CO')} COP por ticket</span>
                        </>
                      )}
                      {promo.discountType === 'package' && (
                        <>
                          <Package className='w-3 h-3 mr-1 text-accent' />
                          <span>{promo.minTickets} tickets por {(promo.packagePrice).toLocaleString('es-CO')} COP</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className='space-y-3'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <Ticket className='w-3.5 h-3.5 text-secondary-600' />
              <span className='text-sm font-medium text-secondary-700'>
                Tickets Disponibles
              </span>
            </div>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='text-xs bg-principal-100 border-principal-400/30 hover:bg-principal-300/30 text-secondary'
              onClick={() => setShowAllTickets(!showAllTickets)}>
              {showAllTickets ? 'Mostrar Menos' : 'Mostrar Todos'}
            </Button>
          </div>

          <div className='grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5 max-h-[250px] overflow-y-auto p-1.5'>
            {availableTickets
              .slice(0, showAllTickets ? undefined : 40)
              .map((number) => (
                <button
                  key={number}
                  type='button'
                  onClick={() => handleTicketClick(number)}
                  className={cn(
                    'p-1.5 text-sm rounded transition-all duration-300',
                    'hover:bg-accent/10 focus:outline-none focus:ring-1 focus:ring-accent/30',
                    selectedTickets.includes(number)
                      ? 'bg-accent/20 text-secondary border border-accent/30'
                      : 'bg-principal-100 text-secondary-700 border border-principal-400/30'
                  )}>
                  {number}
                </button>
              ))}
          </div>

          {!showAllTickets && availableTickets.length > 40 && (
            <p className='text-center text-xs text-secondary-600'>
              Mostrando 40 de {availableTickets.length} tickets disponibles
            </p>
          )}

          <div className='space-y-1.5'>
            <h3 className='text-sm font-medium text-secondary-700'>
              Tickets Seleccionados ({selectedTickets.length}/
              {selectedTickets.length > raffle.minTickets
                ? selectedTickets.length
                : raffle.minTickets}
              )
            </h3>
            <div className='flex flex-wrap gap-1.5'>
              {selectedTickets.map((number) => (
                <span
                  key={number}
                  className='px-2 py-0.5 bg-accent/10 text-accent border border-accent/20 rounded text-xs'>
                  {number}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTickets.length > 0 &&
        selectedTickets.length < raffle.minTickets && (
          <div className='flex items-start gap-2 p-3 rounded-md bg-principal-300/20 border border-accent/20'>
            <AlertCircle className='w-4 h-4 text-accent mt-0.5 flex-shrink-0' />
            <p className='text-xs text-secondary-700'>
              Debes seleccionar al menos {raffle.minTickets} tickets para continuar
            </p>
          </div>
        )}

      <Controller
        name='selectedTickets'
        control={control}
        rules={{
          validate: (value) =>
            value?.length >= raffle.minTickets ||
            `Debes seleccionar al menos ${raffle.minTickets} tickets`,
        }}
        render={({ field }) => <input type='hidden' {...field} />}
      />
    </div>
  )
}

export default TicketSelectionSection
