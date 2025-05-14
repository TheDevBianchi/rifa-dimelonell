import { Controller } from 'react-hook-form'
import { FormField } from '@/components/ui/form-field'

const inputStyles =
  'w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent'

export function PaymentMethodInput({
  name,
  label,
  type,
  placeholder,
  error,
  optional = false,
  required = false,
}) {
  return (
    <FormField label={label} error={error} optional={optional}>
      <Controller
        name={name}
        render={({ field }) => (
          <input
            {...field}
            id={name}
            type={type}
            className={inputStyles}
            placeholder={placeholder}
            aria-required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${name}-error` : undefined}
          />
        )}
      />
    </FormField>
  )
}
