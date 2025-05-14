import { Loader2 } from 'lucide-react'

export function SubmitButton ({ isSubmitting }) {
  return (
    <button
      type='submit'
      disabled={isSubmitting}
      className='w-full bg-primary text-white p-2 rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'
      aria-busy={isSubmitting}
    >
      {isSubmitting ? (
        <span className='flex items-center justify-center gap-2'>
          <Loader2 className='w-4 h-4 animate-spin' />
          <span>Agregando...</span>
        </span>
      ) : (
        'Agregar Método de Pago'
      )}
    </button>
  )
}
