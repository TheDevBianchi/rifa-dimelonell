'use client'

// hooks/useUserRanking.js
import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRaffleStore } from '@/store/use-rifa-store'

export function useUserRanking() {
  const [userRanking, setUserRanking] = useState([])
  const updateUserRanking = useRaffleStore(state => state.updateUserRanking)

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const rankingRef = collection(db, 'userRanking')
        const q = query(rankingRef, orderBy('totalTickets', 'desc'))
        const querySnapshot = await getDocs(q)
        
        const ranking = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          firstPurchase: doc.data().firstPurchase?.toDate(),
          lastPurchase: doc.data().lastPurchase?.toDate()
        }))
        
        setUserRanking(ranking)
      } catch (error) {
        console.error('Error fetching user ranking:', error)
      }
    }

    fetchRanking()
  }, [])

  return userRanking
}
