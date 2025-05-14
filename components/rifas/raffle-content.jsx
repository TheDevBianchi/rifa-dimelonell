import { RaffleDetails } from './raffle-details'
import RaffleForm from './buyTicketForm'

export function RaffleContent ({ raffle, onSubmit }) {
  return (
    <main className='container mx-auto px-4 py-12'>
      <div className='max-w-4xl mx-auto space-y-10'>
        <RaffleDetails raffle={raffle} />
        <div className='bg-principal-200 rounded-xl border border-principal-400/30 shadow-md overflow-hidden pb-8'>
          <div className="bg-accent p-3">
            <h2 className="text-xl font-medium text-white text-center">Selecciona tus boletos</h2>
          </div>
          <RaffleForm raffle={raffle} onSubmit={onSubmit} />
        </div>
      </div>
    </main>
  )
}
