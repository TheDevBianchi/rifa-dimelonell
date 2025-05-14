import { cn } from '@/lib/utils'

export function FormField({ label, error, icon, children, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className='flex items-center justify-between'>
        <label className='text-sm font-medium text-gray-200 flex items-center gap-2'>
          {icon}
          {label}
        </label>
      </div>
      {children}
      {error && (
        <p className='text-sm text-red-400' role='alert'>
          {error.message}
        </p>
      )}
    </div>
  )
}
