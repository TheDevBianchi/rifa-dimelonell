import Link from 'next/link'

export default function SettingsPage () {
  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-2xl font-medium text-secondary mb-6'>Configuración</h1>
      <div className='grid gap-6 grid-cols-1 lg:grid-cols-2'>
        <Link href='/dashboard/settings/payment-methods'>
          <div className='block p-6 bg-principal-100 border-accent rounded-lg shadow-sm hover:bg-principal-200 transition border border-principal-400/30'>
            <h2 className='text-xl font-medium text-secondary mb-2'>
              Métodos de Pago
            </h2>
            <p className='text-secondary-600'>
              Gestiona y configura tus métodos de pago.
            </p>
          </div>
        </Link>
        <Link href='/dashboard/settings/promos'>
          <div className='block p-6 bg-principal-100 rounded-lg shadow-sm hover:bg-principal-200 transition border border-principal-400/30'>
            <h2 className='text-xl font-medium text-secondary mb-2'>
              Promociones
            </h2>
            <p className='text-secondary-600'>
              Configura las promociones para tus rifas.
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
