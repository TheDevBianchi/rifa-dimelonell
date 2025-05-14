import { DollarPriceForm } from '@/components/settings/DollarPriceForm'

export default function DollarPricePage () {
  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Ajustar Precio del Dólar</h1>
      <DollarPriceForm />
    </div>
  )
}
