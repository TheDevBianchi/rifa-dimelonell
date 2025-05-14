import { useState, useEffect, useMemo, useCallback } from 'react';
import { getPromotionsByRaffleId } from '@/utils/firebase/promoService';

/**
 * Hook para gestionar las promociones de una rifa
 * @param {string} raffleId - ID de la rifa
 * @param {number} ticketPrice - Precio original del ticket
 * @returns {Object} - Datos y funciones relacionadas con las promociones
 */
export function usePromotion(raffleId, ticketPrice) {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  // Cargar promociones al iniciar
  useEffect(() => {
    const fetchPromotions = async () => {
      if (!raffleId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const result = await getPromotionsByRaffleId(raffleId);
        
        if (result.success) {
          // Solo mostrar promociones activas
          const activePromos = result.promotions.filter(promo => promo.active);
          setPromotions(activePromos);
        } else {
          setError(result.message);
        }
      } catch (err) {
        console.error('Error al cargar promociones:', err);
        setError('Error al cargar promociones');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPromotions();
  }, [raffleId]);

  /**
   * Calcula el precio total según la promoción seleccionada
   * @param {number} ticketCount - Cantidad de tickets
   * @returns {number} - Precio total con promoción aplicada
   */
  const calculateTotal = useCallback((ticketCount) => {
    if (!ticketCount || ticketCount <= 0) return 0;
    
    // Si no hay promoción seleccionada, usar precio normal
    if (!selectedPromotion) return ticketCount * ticketPrice;
    
    switch (selectedPromotion.discountType) {
      case 'percentage':
        // Aplicar descuento porcentual
        const discountMultiplier = (100 - selectedPromotion.discountValue) / 100;
        return ticketCount * ticketPrice * discountMultiplier;
        
      case 'lower_cost':
        // Usar precio reducido por ticket
        return ticketCount * selectedPromotion.newTicketPrice;
        
      case 'package':
        // Calcular paquetes completos y tickets individuales
        if (ticketCount >= selectedPromotion.minTickets) {
          const packageCount = Math.floor(ticketCount / selectedPromotion.minTickets);
          const remainingTickets = ticketCount % selectedPromotion.minTickets;
          
          return (packageCount * selectedPromotion.packagePrice) + (remainingTickets * ticketPrice);
        }
        return ticketCount * ticketPrice;
        
      default:
        return ticketCount * ticketPrice;
    }
  }, [selectedPromotion, ticketPrice]);

  /**
   * Determina si una promoción es aplicable según la cantidad de tickets
   * @param {Object} promotion - Promoción a evaluar
   * @param {number} ticketCount - Cantidad de tickets
   * @returns {boolean} - Verdadero si la promoción es aplicable
   */
  const isPromotionApplicable = useCallback((promotion, ticketCount) => {
    if (!promotion || !ticketCount) return false;
    
    // Para promociones de paquete, verificar cantidad mínima
    if (promotion.discountType === 'package') {
      return ticketCount >= promotion.minTickets;
    }
    
    // Otras promociones siempre son aplicables
    return true;
  }, []);

  /**
   * Verifica si hay promociones aplicables para la cantidad de tickets
   * @param {number} ticketCount - Cantidad de tickets
   * @returns {Array} - Lista de promociones aplicables
   */
  const getApplicablePromotions = useCallback((ticketCount) => {
    if (!ticketCount || promotions.length === 0) {
      return [];
    }
    
    // Filtrar promociones aplicables
    return promotions.filter(promo => isPromotionApplicable(promo, ticketCount));
  }, [promotions, isPromotionApplicable]);
  
  /**
   * Calcula el mejor ahorro posible entre las promociones disponibles
   * @param {number} ticketCount - Cantidad de tickets
   * @returns {Object} - Información sobre la mejor promoción
   */
  const getBestPromotion = useCallback((ticketCount) => {
    if (!ticketCount || promotions.length === 0) {
      return { promotion: null, savings: 0 };
    }
    
    const applicablePromotions = getApplicablePromotions(ticketCount);
    
    if (applicablePromotions.length === 0) {
      return { promotion: null, savings: 0 };
    }
    
    // Calcular precio con cada promoción
    const promotionPrices = applicablePromotions.map(promo => {
      let price;
      
      switch (promo.discountType) {
        case 'percentage':
          price = ticketCount * ticketPrice * ((100 - promo.discountValue) / 100);
          break;
        case 'lower_cost':
          price = ticketCount * promo.newTicketPrice;
          break;
        case 'package':
          const packageCount = Math.floor(ticketCount / promo.minTickets);
          const remainingTickets = ticketCount % promo.minTickets;
          price = (packageCount * promo.packagePrice) + (remainingTickets * ticketPrice);
          break;
        default:
          price = ticketCount * ticketPrice;
      }
      
      const savings = (ticketCount * ticketPrice) - price;
      return { promotion: promo, price, savings };
    });
    
    // Seleccionar la promoción con el precio más bajo
    return promotionPrices.reduce((best, current) => 
      current.savings > best.savings ? current : best
    , { promotion: null, savings: 0, price: ticketCount * ticketPrice });
  }, [promotions, ticketPrice, getApplicablePromotions]);

  /**
   * Calcula el ahorro obtenido con la promoción
   * @param {number} ticketCount - Cantidad de tickets
   * @returns {number} - Cantidad ahorrada
   */
  const calculateSavings = useCallback((ticketCount) => {
    const regularPrice = ticketCount * ticketPrice;
    const discountedPrice = calculateTotal(ticketCount);
    return regularPrice - discountedPrice;
  }, [calculateTotal, ticketPrice]);

  return {
    promotions,
    loading,
    error,
    selectedPromotion,
    setSelectedPromotion,
    calculateTotal,
    isPromotionApplicable,
    getApplicablePromotions,
    getBestPromotion,
    calculateSavings
  };
}
