import * as z from 'zod'

export const paymentMethodSchema = z.object({
  name: z.string().min(3, 'El nombre del método de pago es requerido'),
  identificationNumber: z.string(),
  bankName: z
    .string()
    .min(2, 'El nombre del banco debe tener al menos 2 caracteres')
    .optional()
    .or(z.literal('')),
  bankCode: z
    .string()
    .min(4, 'El código del banco debe tener al menos 4 caracteres')
    .optional()
    .or(z.literal('')),
  accountNumber: z
    .string()
    .min(5, 'El número de cuenta debe tener al menos 5 caracteres')
    .optional()
    .or(z.literal('')),
  accountType: z
    .string()
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('Correo electrónico inválido')
    .optional()
    .or(z.literal('')),
  contactName: z
    .string()
    .min(3, 'El nombre de contacto debe tener al menos 3 caracteres')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .min(10, 'El número de teléfono debe tener al menos 10 dígitos')
    .optional()
    .or(z.literal(''))
})
