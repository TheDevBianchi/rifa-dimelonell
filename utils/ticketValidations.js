export const validateTicketAvailability = (raffle, requestedTickets) => {
  const soldTickets = raffle.soldTickets?.length || 0
  const reservedTickets = raffle.reservedTickets?.length || 0
  const availableTickets = raffle.totalTickets - (soldTickets + reservedTickets)

  if (availableTickets === 0) {
    throw new Error('Lo sentimos, todos los tickets han sido vendidos')
  }

  if (requestedTickets > availableTickets) {
    throw new Error(`Solo quedan ${availableTickets} tickets disponibles`)
  }

  return true
} 