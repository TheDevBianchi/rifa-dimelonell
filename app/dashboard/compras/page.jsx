'use client'

import { useState, useEffect, useCallback } from 'react'
import { PurchaseTable } from '@/components/purchases/PurchaseTable'
import { getPurchases, getRaffles } from './actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PurchasesPage = () => {
  const [purchases, setPurchases] = useState([])
  const [raffles, setRaffles] = useState([])
  const [selectedRaffle, setSelectedRaffle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRaffles = useCallback(async () => {
    try {
      const result = await getRaffles()
      if (result.success) {
        setRaffles(result.raffles)
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
