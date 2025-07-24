import Image from 'next/image'
import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'

export default function Header() {
  return (
    <>
      {/* Navbar con logo y botones */}
      <header className="bg-principal sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          {/* Logo en la parte izquierda */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.webp" 
              alt="Logo Rifa Dimelonell" 
              width={150} 
              height={50} 
              className="h-12 w-auto" 
            />
          </Link>
          
          {/* Botones de acción en la parte derecha */}
          <div className="flex gap-3">
            <Link 
              href="https://wa.me/573014578611" 
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 border-2 border-accent text-accent hover:bg-accent hover:text-principal-50 rounded-md transition-all duration-300 hover:scale-105"
            >
              <FaWhatsapp className="text-xl" />
              <span>Comprar por WhatsApp</span>
            </Link>
            <Link 
              href="/rifa/1"
              className="flex items-center px-4 py-2 bg-accent text-white hover:bg-accent-600 rounded-md transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            >
              Comprar en Línea
            </Link>
          </div>
        </div>
      </header>
      
      {/* Banner hero por debajo de la navbar */}
      <div className='shadow-lg mb-8 h-[200px] md:h-[300px] lg:h-[800px] w-full overflow-hidden'>
        <div className='relative w-full h-full'>
          <Image
            src='/banner nelson.webp'
            alt='Banner rifa con Dimelonell'
            fill
            className='object-contain md:object-fit w-full h-full'
            priority
          />
        </div>
      </div>
    </>
  )
}
