import * as z from 'zod'

const schema = z.object({
  title: z.string().min(5, 'El título es requerido'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.string().min(1, 'El precio debe ser mayor a 0'),
  totalTickets: z
    .string()
    .min(1, 'El número total de tickets debe ser mayor a 0'),
  soldTickets: z
    .number()
    .int()
    .nonnegative('Los tickets vendidos no pueden ser negativos')
    .default(0),
  minTickets: z.string().min(1, 'Mínimo de tickets requerido'),
  startDate: z.date(),
  images: z.array(z.any()).default([]),
  randomTickets: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
  availableNumbers: z
    .number()
    .int()
    .nonnegative('Los tickets disponibles no pueden ser negativos')
    .default(0),
  reservedNumbers: z.array(z.string()).default([])
})

export { schema }
