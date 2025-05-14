import { Button } from '@/components/ui/button'
import { Loader2, Save } from 'lucide-react'

export function SubmitButton({ isSubmitting, isDirty }) {
  return (
    <Button
      type='submit'
      disabled={isSubmitting || !isDirty}
      className='min-w-[150px]'>
      {isSubmitting ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Actualizando...
        </>
      ) : (
        <>
          <Save className='mr-2 h-4 w-4' />
          Guardar Cambios
        </>
      )}
    </Button>
  )
}
