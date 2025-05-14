export function PurchaseInfo({ label, value }) {
  return (
    <p>
      <span className='font-medium text-secondary'>{label}:</span> {value}
    </p>
  )
}
