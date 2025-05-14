'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import { useRaffles } from '@/hooks/useRaffles'
import { columns } from './columns'
import { useRaffleStore } from '@/store/use-rifa-store'
import { Loader2 } from 'lucide-react'
import { Input } from "@/components/ui/input"

export default function UsersPage() {
  const { raffles, getRaffles } = useRaffles()
  const [selectedRaffle, setSelectedRaffle] = useState('all')
  const [userData, setUserData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const getRankingByRaffle = useRaffleStore(state => state.getRankingByRaffle)

  useEffect(() => {
    getRaffles()
  }, [getRaffles])

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true)
      try {
        const data = await getRankingByRaffle(selectedRaffle)
        setUserData(data)
      } catch (error) {
        console.error('Error loading users:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUserData()
  }, [selectedRaffle, getRankingByRaffle])

  const filteredData = useMemo(() => {
    return userData.filter(user => {
      const searchLower = searchQuery.toLowerCase().trim()
      
      // Convertir los tickets a string y buscar
      const selectedTickets = user.selectedTickets || []
      const ticketsString = selectedTickets.map(ticket => ticket.toString()).join(", ")
      
      return (
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.toLowerCase().includes(searchLower) ||
        ticketsString.toLowerCase().includes(searchLower)
      )
    })
  }, [userData, searchQuery])

  if (isLoading) {
    return (
      <div className="py-10">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-accent mb-4" />
          <p className="text-secondary-600">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-secondary">Usuarios</h1>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Buscar por nombre, correo, teléfono o número de ticket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm bg-principal-200 border-principal-400/30 text-secondary focus:border-accent/50 transition-colors"
          />
          <Select
            value={selectedRaffle}
            onValueChange={setSelectedRaffle}
          >
            <SelectTrigger className="w-[200px] bg-principal-200 border-principal-400/30 text-secondary">
              <SelectValue placeholder="Seleccionar Rifa" />
            </SelectTrigger>
            <SelectContent className="bg-principal-100 border-principal-400/30">
              <SelectItem value="all" className="text-secondary hover:bg-principal-200">Todas las Rifas</SelectItem>
              {raffles?.map((raffle) => (
                <SelectItem key={raffle.id} value={raffle.id} className="text-secondary hover:bg-principal-200">
                  {raffle.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!filteredData.length ? (
        <div className="bg-principal-200/50 rounded-lg p-6 text-center border border-principal-400/30">
          <h2 className="text-lg font-medium text-secondary mb-2">
            No hay usuarios disponibles
          </h2>
          <p className="text-secondary-600">
            {searchQuery 
              ? 'No se encontraron usuarios con los criterios de búsqueda.'
              : selectedRaffle === 'all' 
                ? 'Aún no hay usuarios registrados en el sistema.'
                : 'Esta rifa aún no tiene usuarios registrados.'}
          </p>
        </div>
      ) : (
        <div className="rounded-md border border-principal-400/30 overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredData}
          />
        </div>
      )}
    </div>
  )
}
