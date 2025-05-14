import { db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'

async function getRaffle (id) {
  try {
    const docRef = doc(db, 'raffles', id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate()
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching raffle:', error)
    return null
  }
}

export async function generateMetadata ({ params }) {
  const raffle = await getRaffle(params.id)

  return {
    title: raffle
      ? `${raffle.title} | rifa con jirvin`
      : 'Rifa no encontrada | rifa con jirvin',
    description: raffle
      ? raffle.description
      : 'Lo sentimos, esta rifa no está disponible.',
    openGraph: {
      title: raffle?.title,
      description: raffle?.description,
      images: raffle?.images?.[0] ? [raffle.images[0]] : [],
      type: 'website',
      locale: 'es_ES'
    },
    twitter: {
      card: 'summary_large_image',
      title: raffle?.title,
      description: raffle?.description,
      images: raffle?.images?.[0] ? [raffle.images[0]] : []
    }
  }
}

export default function RaffleLayout ({ children }) {
  return (
    <div>
      <div className='flex flex-col min-h-screen'>{children}</div>
    </div>
  )
}
