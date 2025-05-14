'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { validateAllRaffles, validateRaffleTickets } from '../utils/validateTickets'
import { useRaffleStore } from '../store/use-rifa-store'

const DiscrepancyCard = React.memo(({ discrepancy }) => {
  const getDiscrepancyMessage = () => {
    switch (discrepancy.type) {
      case 'TOTAL_MISMATCH':
        return `Discrepancia en total de tickets: Esperados ${discrepancy.expected}, Actuales ${discrepancy.actual}`
      case 'SOLD_TICKETS_MISMATCH':
        return `Discrepancia en tickets vendidos: En rifa ${discrepancy.expectedSold}, En usuarios confirmados ${discrepancy.actualFromUsers}`
      case 'RESERVED_NUMBERS_MISMATCH':
        return `Discrepancia en números reservados: En rifa ${discrepancy.expectedReserved}, En compras pendientes ${discrepancy.actualReserved}`
      case 'USER_MISMATCH':
        return `Discrepancia en tickets de usuario: ${discrepancy.userName}`
      default:
        return 'Discrepancia desconocida'
    }
  }

  return (
    <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 mb-4">
      <p className="text-yellow-700">{getDiscrepancyMessage()}</p>
      {discrepancy.type === 'USER_MISMATCH' && (
        <div className="mt-2 text-sm">
          <p>Email: {discrepancy.userEmail}</p>
          <p>Tickets en Ranking: {discrepancy.totalInUserRanking}</p>
          <p>Tickets Reales: {discrepancy.actualTicketsCount}</p>
          <p className="font-bold">Diferencia: {discrepancy.discrepancy}</p>
        </div>
      )}
      <p className="text-xs text-gray-500 mt-2">
        Detectado: {new Date(discrepancy.timestamp).toLocaleString()}
      </p>
    </div>
  )
})

DiscrepancyCard.displayName = 'DiscrepancyCard'

const TicketValidation = React.memo(() => {
  const [validationResults, setValidationResults] = useState(null)
  const [loading, setLoadingData] = useState(false)
  const [error, setErrorData] = useState(null)
  
  const setLoadingStore = useRaffleStore(state => state.setLoading)
  const setErrorStore = useRaffleStore(state => state.setError)

  const handleValidation = async () => {
    console.log('Iniciando validación...')
    setLoadingData(true)
    setErrorData(null)
    setLoadingStore(true)
    
    try {
      const results = await validateAllRaffles()
      console.log('Resultados de validación:', results)
      setValidationResults(results)
      
      if (results.totalDiscrepancies > 0) {
        const validationHistory = JSON.parse(localStorage.getItem('validationHistory') || '[]')
        validationHistory.push({
          timestamp: new Date().toISOString(),
          totalDiscrepancies: results.totalDiscrepancies,
          results
        })
        if (validationHistory.length > 10) {
          validationHistory.shift()
        }
        localStorage.setItem('validationHistory', JSON.stringify(validationHistory))
      }
    } catch (err) {
      console.error('Error en la validación:', err)
      const errorMessage = 'Error al validar los tickets: ' + err.message
      setErrorData(errorMessage)
      setErrorStore(errorMessage)
    } finally {
      setLoadingData(false)
      setLoadingStore(false)
    }
  }

  const sortedRifas = useMemo(() => {
    if (!validationResults?.rifas) return []
    return [...validationResults.rifas].sort((a, b) => b.totalDiscrepancies - a.totalDiscrepancies)
  }, [validationResults])

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2">Validando tickets de todas las rifas...</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleValidation}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          Validar Todas las Rifas
        </button>
        
        {validationResults && (
          <div className="text-lg font-semibold">
            Total Discrepancias: {validationResults.totalDiscrepancies}
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {sortedRifas.map((rifa) => (
        <div key={rifa.rifaId} className="mb-8 bg-white rounded-lg shadow-md p-4">
          <div className="border-b pb-4 mb-4">
            <h3 className="text-xl font-bold">
              {rifa.rifaTitle}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
              <div>
                <p className="text-gray-600">Total Tickets</p>
                <p className="font-semibold">{rifa.totalTickets}</p>
              </div>
              <div>
                <p className="text-gray-600">Tickets Vendidos</p>
                <p className="font-semibold">{rifa.soldTickets}</p>
              </div>
              <div>
                <p className="text-gray-600">Tickets Disponibles</p>
                <p className="font-semibold">{rifa.availableNumbers}</p>
              </div>
              <div>
                <p className="text-gray-600">Precio</p>
                <p className="font-semibold">${rifa.price}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {rifa.discrepancies.map((discrepancy, index) => (
              <DiscrepancyCard key={`${rifa.rifaId}-${index}`} discrepancy={discrepancy} />
            ))}
          </div>
        </div>
      ))}

      {validationResults && sortedRifas.length === 0 && (
        <div className="text-green-600 text-center p-4">
          No se encontraron discrepancias en ninguna rifa.
        </div>
      )}
    </div>
  )
})

TicketValidation.displayName = 'TicketValidation'

export default TicketValidation 