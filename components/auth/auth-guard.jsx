'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/use-auth-store'

export function AuthGuard({ children }) {
  const router = useRouter()
  const { user, loading, initializeAuth } = useAuthStore()

  useEffect(() => {
    // Initialize auth when component mounts
    const unsubscribe = initializeAuth()
    return () => unsubscribe()
  }, [initializeAuth])

  useEffect(() => {
    // Only redirect if we're not loading and there's no user
    if (!loading && !user) {
      router.push('/auth/sign-in')
    }
  }, [user, loading, router])

  // Show loading state only during initial load
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary' />
      </div>
    )
  }

  // Don't render anything if there's no user
  if (!user) {
    return null
  }

  return <>{children}</>
}
