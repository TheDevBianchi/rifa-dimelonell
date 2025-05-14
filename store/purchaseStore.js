import { create } from 'zustand'

export const usePurchaseStore = create((set) => ({
  isPurchaseModalOpen: false,
  setPurchaseModalOpen: (isOpen) => set({ isPurchaseModalOpen: isOpen }),
})) 