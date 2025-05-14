import { RaffleSkeleton } from './raffle-skeleton'

export function RaffleLoadingState () {
  return (
    <main className='flex items-center justify-center container mx-auto px-4 py-12'>
      <RaffleSkeleton />
    </main>
  )
}
