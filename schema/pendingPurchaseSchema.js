import * as z from 'zod';

export const pendingPurchaseSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres'),

  email: z
    .string()
    .email('El correo electrónico no es válido')
    .min(1, 'El correo electrónico es requerido'),

  phone: z
    .string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(15, 'El teléfono no puede exceder los 15 dígitos')
    .regex(/^\+?[\d\s-]+$/, 'Número de teléfono inválido'),

  paymentMethod: z
    .string()
    .min(1, 'Selecciona un método de pago'),

  paymentReference: z
    .string()
    .min(6, 'La referencia debe tener al menos 6 caracteres')
    .max(50, 'La referencia no puede exceder los 50 caracteres'),

  selectedTickets: z
    .array(
      z.string()
    )
    .min(1, 'Debes seleccionar al menos un ticket')
}); 