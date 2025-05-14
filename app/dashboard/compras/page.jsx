'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePurchaseStore } from '@/store/purchaseStore'
import { PurchaseTable } from '@/components/purchases/PurchaseTable'
import { CreatePurchaseModal } from '@/components/purchases/CreatePurchaseModal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { getPurchases, getRaffles } from './actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PurchasesPage = () => {
  const { isPurchaseModalOpen, setPurchaseModalOpen } = usePurchaseStore()
  const [purchases, setPurchases] = useState([])
  const [raffles, setRaffles] = useState([])
  const [selectedRaffle, setSelectedRaffle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Obtener la lista de rifas
  const fetchRaffles = useCallback(async () => {
    try {
      const result = await getRaffles()
      if (result.success) {
        setRaffles(result.raffles)
        // Seleccionar la primera rifa por defecto si existe
        if (result.raffles.length > 0) {
          setSelectedRaffle(result.raffles[0].id)
        }
      }
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const fetchPurchases = useCallback(async () => {
    if (!selectedRaffle) return

    try {
      setIsLoading(true)
      const result = await getPurchases(1, 20, selectedRaffle)
      if (result.success) {
        setPurchases(result.purchases)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [selectedRaffle])

  useEffect(() => {
    fetchRaffles()
  }, [fetchRaffles])

  useEffect(() => {
    fetchPurchases()
  }, [fetchPurchases, selectedRaffle])

  const handlePurchaseUpdate = useCallback((newPurchases) => {
    setPurchases(newPurchases)
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-red-500">
          Error al cargar las compras: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 bg-principal-200">
      <div className="flex justify-between items-center mb-6 border-b border-secondary pb-2">
        <h1 className="text-2xl font-bold text-secondary">Gestión de Compras</h1>
        <Button onClick={() => setPurchaseModalOpen(true)} className="bg-accent text-white hover:bg-accent/90">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Compra
        </Button>
      </div>

      <div className="mb-6">
        <Select
          value={selectedRaffle}
          onValueChange={setSelectedRaffle}
        >
          <SelectTrigger className="w-[280px] bg-principal-200 border-secondary focus:border-accent text-secondary">
            <SelectValue placeholder="Selecciona una rifa" />
          </SelectTrigger>
          <SelectContent className="bg-principal-100 roundend-sm border border-secondary text-secondary">
            {raffles.map((raffle) => (
              <SelectItem key={raffle.id} value={raffle.id}>
                {raffle.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <PurchaseTable 
        purchases={purchases} 
        isLoading={isLoading}
        onPurchaseUpdate={handlePurchaseUpdate}
      />
    </div>
  )
}

export default PurchasesPage
