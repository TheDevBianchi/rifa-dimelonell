import { Label } from '@/components/ui/label'

const FormField = ({ label, error, children, icon: Icon }) => (
  <div className='space-y-2'>
    <Label className='flex items-center gap-2 text-gray-200'>
      {Icon && <Icon className='w-4 h-4 text-gray-400' />}
      {label}
    </Label>
    {children}
    {error && <p className='text-sm text-red-500'>{error}</p>}
  </div>
)

export default FormField
