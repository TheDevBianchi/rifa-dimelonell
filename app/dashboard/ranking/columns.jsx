import { formatDate } from "@/lib/utils"
import { useMemo } from 'react'

export const columns = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "email",
    header: "Correo",
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
  },
  {
    accessorKey: "totalTickets",
    header: "Total Tickets",
    cell: ({ row }) => {
      const tickets = row.original.totalTickets || 0;
      return tickets;
    }
  },
  {
    accessorKey: "lastPurchase",
    header: "Última Compra",
    cell: ({ row }) => {
      const date = row.original.lastPurchase;
      
      try {
        if (!date) return "Sin compras";
        const formattedDate = formatDate(date);
        return formattedDate || "Fecha inválida";
      } catch (error) {
        console.error("Error al formatear la fecha:", error);
        return "Fecha no disponible";
      }
    },
  },
  {
    accessorKey: "raffleName",
    header: "Rifa",
  }
] 