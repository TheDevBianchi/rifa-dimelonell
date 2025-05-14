import { create } from 'zustand'
import { createRaffleSlice } from './slices/raffleSlice'
import { createTicketSlice } from './slices/ticketSlice'
import { createPurchaseSlice } from './slices/purchaseSlice'
import { createApprovalSlice } from './slices/approvalSlice'
import { createRankingSlice } from './slices/rankingSlice'

export const useRaffleStore = create((set, get) => ({
  // Estado base
  loading: false,
  error: null,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Combinar los slices
  ...createRaffleSlice(set, get),
  ...createTicketSlice(set, get),
  ...createPurchaseSlice(set, get),
  ...createApprovalSlice(set, get),
  ...createRankingSlice(set, get)
}))
