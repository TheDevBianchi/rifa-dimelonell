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
              href="https://wa.me/+573123456789" 
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
      <div className='bg-footer-gradient shadow-lg mb-8 h-[200px] md:h-[250px] lg:h-[500px]'>
        <div className='relative w-full h-full'>
          <Image
            src='/Banner.webp'
            alt='Banner rifa con jirvin'
            fill
            className='object-cover'
            priority
          />
          <div className="absolute inset-0 bg-secondary-900/40 flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-wide">
              Gana Increíbles Premios
            </h1>
            <p className="text-lg md:text-xl text-white max-w-2xl mb-6">
              Participa en nuestras rifas y cumple tus sueños con premios exclusivos
            </p>
            <Link 
              href="/rifa/1"
              className="px-6 py-3 bg-accent text-white font-semibold rounded-md hover:bg-accent-600 transition-all duration-800 hover:scale-105 shadow-lg animate-pulse"
            >
              ¡Compra Tu Boleto Ahora!
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
