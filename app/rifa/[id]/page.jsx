'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { RaffleLoadingState } from '@/components/rifas/raffle-loading-state'
import { RaffleErrorState } from '@/components/rifas/raffle-error-state'
import { RaffleContent } from '@/components/rifas/raffle-content'
import SuccessModal from '@/components/rifas/success-modal'
import { useRaffleDetails } from '@/hooks/useRaffleDetails'

const RafflePage = () => {
  const { id } = useParams()
  const {
    raffle,
    isLoading,
    showSuccessModal,
    submittedData,
    fetchRaffle,
    handleSubmit,
    setShowSuccessModal
  } = useRaffleDetails(id)

  useEffect(() => {
    fetchRaffle()
  }, [fetchRaffle])

  return (
    <div className='min-h-screen bg-principal-200 relative overflow-hidden'>
      <div className=''></div>
      <div className='relative'>
        <Header />
        {isLoading ? (
          <RaffleLoadingState />
        ) : raffle ? (
          <RaffleContent raffle={raffle} onSubmit={handleSubmit} />
        ) : (
          <RaffleErrorState />
        )}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          purchaseData={submittedData}
          raffle={raffle}
        />
        <Footer />
      </div>
    </div>
  )
}

export default RafflePage
