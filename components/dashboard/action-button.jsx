import { Check, X, Loader2 } from 'lucide-react'

export function ActionButton ({ onClick, disabled, variant, isLoading }) {
  const variants = {
    approve: {
      baseClass: 'bg-accent hover:bg-accent/90',
      icon: Check,
      text: 'Aprobar',
      loadingText: 'Aprobando...'
    },
    reject: {
      baseClass: 'bg-red-500 hover:bg-red-500/90',
      icon: X,
      text: 'Rechazar',
      loadingText: 'Rechazando...'
    }
  }

  const { baseClass, icon: Icon, text, loadingText } = variants[variant]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 ${baseClass} text-white py-1.5 px-3 rounded transition-colors flex items-center justify-center gap-1.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <>
          <Loader2 size={14} className='animate-spin' />
          {loadingText}
        </>
      ) : (
        <>
          <Icon size={14} />
          {text}
        </>
      )}
    </button>
  )
}
