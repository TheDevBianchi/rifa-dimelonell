import React, { useState, useEffect } from 'react';
import { getPromotionsByRaffleId } from '@/utils/firebase/promoService';
import { Percent, Package, ArrowDownCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * Componente para mostrar las promociones activas de una rifa
 */
export function PromoDisplay({ raffleId, ticketPrice }) {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      if (!raffleId) return;
      
      try {
        setLoading(true);
        const result = await getPromotionsByRaffleId(raffleId);
        
        if (result.success) {
          // Solo mostrar promociones activas
          const activePromos = result.promotions.filter(promo => promo.active);
          setPromotions(activePromos);
        }
      } catch (error) {
        console.error('Error al cargar promociones:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPromotions();
  }, [raffleId]);
  
  // Si no hay promociones o está cargando, no mostrar nada
  if (loading || promotions.length === 0) {
    return <div className="mt-2 space-y-1">
      <h4 className="text-xs font-medium text-secondary-600">No hay promociones disponibles</h4>
    </div>;
  }
  
  return (
    <div className="mt-2 space-y-1">
      <h4 className="text-xs font-medium text-secondary-600">Promociones Disponibles:</h4>
      <div className="space-y-1.5">
        {promotions.map((promo) => (
          <div 
            key={promo.id} 
            className="bg-principal-200/80 border border-principal-400/30 rounded p-1.5 text-xs"
          >
            <div className="font-medium text-secondary mb-0.5">{promo.name}</div>
            {promo.discountType === 'percentage' && (
              <div className="flex items-center text-accent">
                <Percent className="h-3 w-3 mr-1" />
                <span>{promo.discountValue}% de descuento</span>
              </div>
            )}
            
            {promo.discountType === 'lower_cost' && (
              <div className="flex flex-wrap items-center text-accent">
                <ArrowDownCircle className="h-3 w-3 mr-1" />
                <span>Precio especial: {(promo.newTicketPrice).toLocaleString('es-CO')} COP por ticket</span>
                <Badge className="ml-1 mt-0.5 bg-principal-300 text-secondary text-[10px]">
                                      Ahorra {((ticketPrice - promo.newTicketPrice)).toLocaleString('es-CO')} COP
                </Badge>
              </div>
            )}
            
            {promo.discountType === 'package' && (
              <div className="flex flex-wrap items-center text-accent">
                <Package className="h-3 w-3 mr-1" />
                <span>{promo.minTickets} tickets por {(promo.packagePrice).toLocaleString('es-CO')} COP</span>
                {ticketPrice && (
                  <Badge className="ml-1 mt-0.5 bg-principal-300 text-secondary text-[10px]">
                                          Ahorra {(((ticketPrice * promo.minTickets) - promo.packagePrice)).toLocaleString('es-CO')} COP
                  </Badge>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
