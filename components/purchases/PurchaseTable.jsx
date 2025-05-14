import { memo, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from '@/components/ui/button'
import { UndoAction } from './UndoAction'
import { TableSkeleton } from './TableSkeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const PurchaseTable = memo(({ purchases, isLoading, selectedRaffle, onPurchaseUpdate }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const totalPages = Math.ceil(purchases.length / itemsPerPage)
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPurchases = purchases.slice(startIndex, endIndex)

  if (isLoading) return <TableSkeleton />

  const formatDate = (timestamp) => {
    try {
      // Si es una fecha en formato string (nuevo formato UTC-4)
      if (typeof timestamp === 'string') {
        return timestamp;
      }
      
      // Si es un timestamp de Firestore (formato antiguo)
      if (timestamp?.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/Caracas' // UTC-4
        }) + ' UTC-4';
      }

      // Si es una fecha inválida o no existe
      return 'Fecha no disponible';
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha no disponible';
    }
  }

  const renderPaginationButtons = () => {
    const buttons = []
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, startPage + 4)

    // Ajustar el rango si estamos cerca del final
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4)
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <PaginationItem key={i}>
          <PaginationLink
            className={`w-10 h-10 ${currentPage === i ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-accent hover:text-accent-foreground'}`}
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return buttons
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Comprador</TableHead>
              <TableHead>Rifa</TableHead>
              <TableHead>Tickets</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPurchases?.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>
                  {formatDate(purchase.purchaseDate || purchase.createdAt)}
                </TableCell>
                <TableCell>{purchase.name}</TableCell>
                <TableCell>{purchase.raffleName}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="cursor-pointer underline">
                          {purchase.selectedTickets.length} tickets
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-wrap">
                          Números: {purchase.selectedTickets.sort((a, b) => a - b).join(', ')}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <UndoAction 
                    purchase={purchase} 
                    selectedRaffle={selectedRaffle}
                    onPurchaseUpdate={onPurchaseUpdate} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent className="flex gap-2">
            <PaginationItem>
              <PaginationPrevious 
                className="h-10 px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            
            {currentPage > 3 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    className="w-10 h-10 hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {currentPage > 4 && (
                  <PaginationItem>
                    <span className="w-10 h-10 flex items-center justify-center">
                      ...
                    </span>
                  </PaginationItem>
                )}
              </>
            )}

            {renderPaginationButtons()}

            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <PaginationItem>
                    <span className="w-10 h-10 flex items-center justify-center">
                      ...
                    </span>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    className="w-10 h-10 hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext 
                className="h-10 px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
})

PurchaseTable.displayName = 'PurchaseTable' 