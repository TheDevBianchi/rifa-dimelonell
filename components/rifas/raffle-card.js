'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react'
import TicketVerificationModal from './ticket-verification-modal'
import { PromoDisplay } from './PromoDisplay'

export function RaffleCardSkeleton () {
  return (
    <div className='relative bg-principal-100 rounded-lg border border-principal-400/30 overflow-hidden transition-all duration-300 animate-pulse'>
      <div className='relative h-56 bg-principal-300/50 rounded-t-lg' />
      <div className='flex flex-col p-4 space-y-3'>
        <div className='h-5 bg-principal-300/50 rounded w-3/4' />
        <div className='h-4 bg-principal-300/50 rounded w-full' />
        <div className='flex justify-between items-center'>
          <div className='h-4 bg-principal-300/50 rounded w-16' />
          <div className='h-5 bg-principal-300/50 rounded w-28' />
        </div>
        <div className='h-3 bg-principal-300/50 rounded w-full' />
        <div className='flex gap-2 pt-1'>
          <div className='flex-1 h-8 bg-principal-300/50 rounded' />
          <div className='h-8 bg-principal-300/50 rounded w-20' />
        </div>
      </div>
    </div>
  )
}

export function RaffleCard ({ raffle }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
  const images = raffle.images

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    })
  }, [emblaApi])

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()

  return (
    <div className='relative bg-principal-100 rounded-lg border border-principal-400/30 hover:border-accent/30 overflow-hidden transition-all duration-300 hover:shadow-sm'>
      <div className='relative'>
        <div className='overflow-hidden' ref={emblaRef}>
          <div className='flex'>
            {images && images.length > 0 ? (
              images.map((image, index) => (
                <div key={index} className='flex-[0_0_100%] min-w-0'>
                  <div className='relative h-56 transition-transform duration-300 group-hover:scale-105'>
                    <Image
                      src={`${image}`}
                      alt={`${raffle.title} - Imagen ${index + 1}`}
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className='flex-[0_0_100%] min-w-0'>
                <div className='relative h-56 bg-principal-300/50 flex items-center justify-center'>
                  <span className='text-secondary-600'>
                    No hay imágenes disponibles
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Carousel controls */}
        <button
          onClick={scrollPrev}
          className='absolute left-2 top-1/2 -translate-y-1/2 bg-principal-200/80 p-1.5 rounded-full hover:bg-principal-300/80 transition-colors'
        >
          <ChevronLeft className='w-4 h-4 text-secondary' />
        </button>
        <button
          onClick={scrollNext}
          className='absolute right-2 top-1/2 -translate-y-1/2 bg-principal-200/80 p-1.5 rounded-full hover:bg-principal-300/80 transition-colors'
        >
          <ChevronRight className='w-4 h-4 text-secondary' />
        </button>

        {/* Indicators */}
        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5'>
          {raffle.images &&
            raffle.images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? 'bg-accent w-3'
                    : 'bg-principal-400/50 hover:bg-principal-400/80'
                }`}
              />
            ))}
        </div>
      </div>

      <div className='flex flex-col p-4 space-y-3'>
        <h3 className='text-lg font-medium text-secondary hover:text-accent transition-colors'>
          {raffle.title}
        </h3>
        <p className='text-secondary-700 text-sm line-clamp-2'>{raffle.description}</p>
        <div className='flex justify-between items-center'>
          <span className='text-secondary-600 text-sm'>Precio:</span>
          <span className='text-accent font-medium'>
            {(raffle.price * 4000).toLocaleString('es-CO')} COP
          </span>
        </div>
        
        {/* Mostrar promociones activas */}
        <PromoDisplay raffleId={raffle.id} ticketPrice={raffle.price} />
        <div className='flex gap-2 pt-1'>
          <Link
            href={`/rifa/${raffle.id}`}
            className='
              flex-1 bg-accent text-white py-2 px-4 rounded font-medium text-sm
              hover:bg-accent/90 transition-colors text-center hover:cursor-pointer
            '
          >
            Participar
          </Link>
          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className='
              bg-principal-300 text-secondary py-2 px-3 rounded font-medium text-sm
              hover:bg-principal-400 transition-colors
            '
          >
            Verificar
          </button>
        </div>
        <TicketVerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          raffleId={raffle.id}
        />
      </div>
    </div>
  )
}
