export function RaffleErrorState () {
  return (
    <main className='flex items-center justify-center container mx-auto px-4 py-12'>
      <div className='text-center py-12'>
        <h2 className='text-2xl font-bold text-white'>Rifa no encontrada</h2>
        <p className='text-gray-400 mt-2'>
          La rifa que buscas no existe o ha sido eliminada
        </p>
      </div>
    </main>
  )
}
