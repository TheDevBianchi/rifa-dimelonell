export function FormField ({ label, children, error, optional = true }) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-secondary flex items-center gap-2'>
        {label}
        {optional && <span className='text-xs text-secondary'>(Opcional)</span>}
      </label>
      {children}
      {error && (
        <p className='text-sm text-accent' role='alert'>
          {error.message}
        </p>
      )}
    </div>
  )
}
