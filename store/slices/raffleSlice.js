import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { RaffleStatus } from '../types'
import { uploadToCloudinaryClient } from '@/lib/cloudinary-client'

export const createRaffleSlice = (set, get) => ({
  raffles: [],

  // Acciones básicas
  setRaffles: (raffles) => set({ raffles }),

  // Acciones de Firebase
  createRaffle: async (raffleData) => {
    const { setLoading, setError } = get()
    setLoading(true)

    try {
      // Subir las imágenes directamente a Cloudinary desde el cliente
      const imageUrls = await Promise.all(
        raffleData.images.map(async (img) => {
          // Verificar que img.file sea un objeto File válido
          if (img.file && typeof img.file === 'object') {
            // Usar la función de cliente para subir a Cloudinary
            return await uploadToCloudinaryClient(img.file)
          } else if (typeof img === 'string') {
            // Si ya es una URL, devolverla directamente
            return img
          } else {
            throw new Error('Formato de imagen no válido')
          }
        })
      )

      const raffleWithImages = {
        ...raffleData,
        images: imageUrls,
        createdAt: new Date(),
        status: RaffleStatus.ACTIVE,
        soldTickets: [],
        reservedTickets: [],
        availableNumbers: parseInt(raffleData.totalTickets, 10),
        pendingPurchases: [],
        randomTickets: raffleData.randomTickets
      }

      const docRef = await addDoc(collection(db, 'raffles'), raffleWithImages)
      const newRaffle = { id: docRef.id, ...raffleWithImages }

      set((state) => ({
        raffles: [...state.raffles, newRaffle]
      }))

      return docRef.id
    } catch (error) {
      console.error('Error al crear la rifa:', error)
      setError(error.message || 'Error al crear la rifa')
      throw error
    } finally {
      setLoading(false)
    }
  },

  getRaffles: async () => {
    const { setLoading, setError } = get()
    setLoading(true)

    try {
      const querySnapshot = await getDocs(collection(db, 'raffles'))
      const raffles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }))

      set({ raffles })
    } catch (error) {
      setError('Error al obtener las rifas')
    } finally {
      setLoading(false)
    }
  },

  updateRaffle: async (id, raffleData) => {
    const { setLoading, setError } = get()
    setLoading(true)

    try {
      // Si hay nuevas imágenes, subirlas directamente a Cloudinary desde el cliente
      let imageUrls = raffleData.images
      if (Array.isArray(raffleData.images) && raffleData.images.some(img => img.file)) {
        imageUrls = await Promise.all(
          raffleData.images.map(async (img) => {
            if (img.file && typeof img.file === 'object') {
              // Usar la función de cliente para subir a Cloudinary
              return await uploadToCloudinaryClient(img.file)
            } else if (typeof img === 'string') {
              // Si ya es una URL, devolverla directamente
              return img
            } else {
              // Si es un objeto con URL, extraer la URL
              return img.url || img
            }
          })
        )
      }

      const raffleWithImages = {
        ...raffleData,
        images: imageUrls,
        updatedAt: new Date()
      }

      await updateDoc(doc(db, 'raffles', id), raffleWithImages)

      set((state) => ({
        raffles: state.raffles.map((raffle) =>
          raffle.id === id ? { ...raffle, ...raffleWithImages } : raffle
        )
      }))
    } catch (error) {
      console.error('Error al actualizar la rifa:', error)
      setError(error.message || 'Error al actualizar la rifa')
      throw error
    } finally {
      setLoading(false)
    }
  },

  deleteRaffle: async (id) => {
    const { setLoading, setError } = get()
    setLoading(true)

    try {
      await deleteDoc(doc(db, 'raffles', id))
      set(state => ({
        raffles: state.raffles.filter(raffle => raffle.id !== id)
      }))
    } catch (error) {
      setError('Error al eliminar la rifa')
      throw error
    } finally {
      setLoading(false)
    }
  }
}) 