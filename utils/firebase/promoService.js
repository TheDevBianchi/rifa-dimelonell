import { db } from '@/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

const PROMOS_COLLECTION = 'promotions';

/**
 * Crea una nueva promoción en Firestore
 * @param {Object} promoData - Datos de la promoción
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const createPromotion = async (promoData) => {
  try {
    // Añadir timestamps
    const promoWithTimestamp = {
      ...promoData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      active: true // Por defecto las promociones están activas
    };

    const docRef = await addDoc(collection(db, PROMOS_COLLECTION), promoWithTimestamp);
    
    return {
      success: true,
      id: docRef.id,
      message: 'Promoción creada exitosamente'
    };
  } catch (error) {
    console.error('Error al crear promoción:', error);
    return {
      success: false,
      message: 'Error al crear la promoción: ' + error.message
    };
  }
};

/**
 * Actualiza una promoción existente
 * @param {string} promoId - ID de la promoción
 * @param {Object} promoData - Datos actualizados
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const updatePromotion = async (promoId, promoData) => {
  try {
    const promoRef = doc(db, PROMOS_COLLECTION, promoId);
    
    // Añadir timestamp de actualización
    const updatedData = {
      ...promoData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(promoRef, updatedData);
    
    return {
      success: true,
      message: 'Promoción actualizada exitosamente'
    };
  } catch (error) {
    console.error('Error al actualizar promoción:', error);
    return {
      success: false,
      message: 'Error al actualizar la promoción: ' + error.message
    };
  }
};

/**
 * Elimina una promoción
 * @param {string} promoId - ID de la promoción
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const deletePromotion = async (promoId) => {
  try {
    const promoRef = doc(db, PROMOS_COLLECTION, promoId);
    await deleteDoc(promoRef);
    
    return {
      success: true,
      message: 'Promoción eliminada exitosamente'
    };
  } catch (error) {
    console.error('Error al eliminar promoción:', error);
    return {
      success: false,
      message: 'Error al eliminar la promoción: ' + error.message
    };
  }
};

/**
 * Desactiva una promoción (alternativa a eliminarla)
 * @param {string} promoId - ID de la promoción
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const togglePromoStatus = async (promoId, active) => {
  try {
    const promoRef = doc(db, PROMOS_COLLECTION, promoId);
    await updateDoc(promoRef, { 
      active: active,
      updatedAt: serverTimestamp()
    });
    
    return {
      success: true,
      message: `Promoción ${active ? 'activada' : 'desactivada'} exitosamente`
    };
  } catch (error) {
    console.error('Error al cambiar estado de promoción:', error);
    return {
      success: false,
      message: 'Error al cambiar el estado de la promoción: ' + error.message
    };
  }
};

/**
 * Obtiene todas las promociones
 * @returns {Promise<Object>} - Promociones y resultado
 */
export const getAllPromotions = async () => {
  try {
    const q = query(collection(db, PROMOS_COLLECTION));
    const querySnapshot = await getDocs(q);
    
    const promotions = [];
    querySnapshot.forEach((doc) => {
      promotions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      success: true,
      promotions
    };
  } catch (error) {
    console.error('Error al obtener promociones:', error);
    return {
      success: false,
      promotions: [],
      message: 'Error al obtener promociones: ' + error.message
    };
  }
};

/**
 * Obtiene promociones por ID de rifa
 * @param {string} raffleId - ID de la rifa
 * @returns {Promise<Object>} - Promociones y resultado
 */
export const getPromotionsByRaffleId = async (raffleId) => {
  try {
    const q = query(
      collection(db, PROMOS_COLLECTION), 
      where('raffleId', '==', raffleId),
      where('active', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    const promotions = [];
    querySnapshot.forEach((doc) => {
      promotions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      success: true,
      promotions
    };
  } catch (error) {
    console.error('Error al obtener promociones por rifa:', error);
    return {
      success: false,
      promotions: [],
      message: 'Error al obtener promociones: ' + error.message
    };
  }
};

/**
 * Obtiene una promoción por su ID
 * @param {string} promoId - ID de la promoción
 * @returns {Promise<Object>} - Promoción y resultado
 */
export const getPromotionById = async (promoId) => {
  try {
    const promoRef = doc(db, PROMOS_COLLECTION, promoId);
    const promoSnap = await getDoc(promoRef);
    
    if (promoSnap.exists()) {
      return {
        success: true,
        promotion: {
          id: promoSnap.id,
          ...promoSnap.data()
        }
      };
    } else {
      return {
        success: false,
        message: 'Promoción no encontrada'
      };
    }
  } catch (error) {
    console.error('Error al obtener promoción:', error);
    return {
      success: false,
      message: 'Error al obtener la promoción: ' + error.message
    };
  }
};
