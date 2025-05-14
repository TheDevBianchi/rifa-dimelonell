export const columns = [
  {
    accessorKey: "name",
    header: "Nombre",
    filterFn: "includesString"
  },
  {
    accessorKey: "email",
    header: "Correo",
    filterFn: "includesString"
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
    filterFn: "includesString"
  },
  {
    accessorKey: "selectedTickets",
    header: "Tickets Comprados",
    cell: ({ row }) => {
      const tickets = row.original.selectedTickets || []
      return Array.isArray(tickets) ? tickets.join(", ") : "N/A"
    }
  },
  {
    accessorKey: "ticketCount",
    header: "Cantidad de Tickets",
    cell: ({ row }) => {
      const tickets = row.original.selectedTickets || []
      return Array.isArray(tickets) ? tickets.length : 0
    }
  },
  {
    accessorKey: "raffleName",
    header: "Rifa",
    filterFn: "includesString"
  },
]
