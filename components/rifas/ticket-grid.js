import { useState, useMemo, useCallback, memo } from 'react'
import { UserInfoDialog } from '@/components/dashboard/UserInfoDialog'
import { UnreservTicketDialog } from '@/components/dashboard/UnreservTicketDialog'

const TicketGrid = memo(({
  totalTickets,
  reservedTickets,
  soldTickets = [],
  selectedTickets,
  onTicketClick,
  isDashboard = false,
  randomTickets = false,
  users = [],
  onUnreserveTicket,
  highlightedTicket
}) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [ticketToUnreserve, setTicketToUnreserve] = useState(null)
  const [isUnreserving, setIsUnreserving] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)

  // Memoizar la función de normalización
  const normalizeTicketNumber = useMemo(() => {
    return (number) => {
      const cleanNumber = typeof number === 'string' ? parseInt(number, 10) : number
      if (totalTickets <= 100) return cleanNumber.toString().padStart(2, '0')
      if (totalTickets <= 1000) return cleanNumber.toString().padStart(3, '0')
      if (totalTickets <= 10000) return cleanNumber.toString().padStart(4, '0')
      return cleanNumber.toString()
    }
  }, [totalTickets])

  // Memoizar los tickets normalizados
  const {
    normalizedSoldTickets,
    normalizedReservedTickets,
    normalizedSelectedTickets
  } = useMemo(() => {
    return {
      normalizedSoldTickets: new Set(soldTickets.map(ticket => normalizeTicketNumber(ticket))),
      normalizedReservedTickets: new Set(reservedTickets.map(ticket => normalizeTicketNumber(ticket))),
      normalizedSelectedTickets: new Set(selectedTickets.map(ticket => normalizeTicketNumber(ticket)))
    }
  }, [soldTickets, reservedTickets, selectedTickets, normalizeTicketNumber])

  // Memoizar el mapa de usuarios por ticket
  const usersByTicket = useMemo(() => {
    const map = new Map()
    users.forEach(user => {
      if (user.status === 'confirmed') {
        user.selectedTickets.forEach(ticket => {
          map.set(normalizeTicketNumber(ticket), user)
        })
      }
    })
    return map
  }, [users, normalizeTicketNumber])

  const handleTicketClick = useCallback((number, isReserved) => {
    if (isDashboard) {
      if (isReserved) {
        setTicketToUnreserve(number)
      } else {
        const formattedNumber = normalizeTicketNumber(number)
        const buyer = usersByTicket.get(formattedNumber)
        if (buyer) {
          setSelectedUser({
            ...buyer,
            ticketNumber: formattedNumber
          })
          setDialogOpen(true)
        }
      }
    } else {
      onTicketClick(number)
    }
  }, [isDashboard, normalizeTicketNumber, usersByTicket, onTicketClick])

  const handleUnreserveConfirm = useCallback(async () => {
    setIsUnreserving(true)
    try {
      await onUnreserveTicket(ticketToUnreserve)
    } finally {
      setIsUnreserving(false)
      setTicketToUnreserve(null)
    }
  }, [ticketToUnreserve, onUnreserveTicket])

  // Memoizar la generación de tickets
  const tickets = useMemo(() => {
    return Array.from({ length: totalTickets }, (_, i) => {
      const number = i
      const formattedNumber = normalizeTicketNumber(number)
      const isReserved = normalizedReservedTickets.has(formattedNumber)
      const isSold = normalizedSoldTickets.has(formattedNumber)
      const isSelected = normalizedSelectedTickets.has(formattedNumber)
      const isHighlighted = highlightedTicket === number
      const buyer = usersByTicket.get(formattedNumber)

      return {
        number,
        formattedNumber,
        isReserved,
        isSold,
        isSelected,
        isHighlighted,
        buyer,
        isDisabled: !isDashboard && (isReserved || isSold),
        cursorStyle: isDashboard
          ? 'cursor-pointer'
          : isReserved || isSold
          ? 'cursor-not-allowed'
          : 'cursor-pointer'
      }
    })
  }, [
    totalTickets,
    normalizeTicketNumber,
    normalizedReservedTickets,
    normalizedSoldTickets,
    normalizedSelectedTickets,
    highlightedTicket,
    usersByTicket,
    isDashboard
  ])

  return (
    <>
      <div className='grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2'>
        {tickets.map(ticket => (
          <button
            key={ticket.number}
            id={`ticket-${ticket.number}`}
            type='button'
            onClick={() => {
              if (isDashboard && ticket.buyer) {
                setSelectedUser({
                  ...ticket.buyer,
                  ticketNumber: ticket.formattedNumber
                })
                setDialogOpen(true)
                setSelectedIndex(ticket.number)
              } else {
                handleTicketClick(ticket.number, ticket.isReserved)
              }
            }}
            disabled={ticket.isDisabled}
            aria-label={`Número ${ticket.formattedNumber}${
              ticket.isReserved ? ', reservado' : ticket.isSold ? ', vendido' : ''
            }`}
            aria-pressed={ticket.isSelected}
            className={`
              p-2 text-center border rounded
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
              ${ticket.cursorStyle}
              ${ticket.isHighlighted ? 'ring-4 ring-accent ring-opacity-75' : ''}
              ${ticket.isSelected ? 'bg-accent text-white' : ''}
              ${
                ticket.isReserved
                  ? 'bg-amber-500 text-white hover:bg-amber-600 border-secondary'
                  : ticket.isSold
                  ? 'bg-accent text-white hover:bg-accent/90 border-secondary'
                  : 'bg-principal-300 text-secondary hover:bg-principal-400 border-secondary'
              }
            `}
          >
            {ticket.formattedNumber}
          </button>
        ))}
      </div>

      <UserInfoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        index={selectedIndex}
      />

      <UnreservTicketDialog
        selectedTicket={ticketToUnreserve}
        isUnreserving={isUnreserving}
        onClose={() => setTicketToUnreserve(null)}
        onConfirm={handleUnreserveConfirm}
        index={selectedIndex}
      />
    </>
  )
})

TicketGrid.displayName = 'TicketGrid'
export default TicketGrid
