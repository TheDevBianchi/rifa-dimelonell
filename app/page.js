import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { RafflesSection } from '@/components/rifas/RafflesSection'
import Link from 'next/link'
import Image from 'next/image'
import { FaCreditCard } from 'react-icons/fa'

// Función para formatear precios en COP
const formatCOP = (price) => {
  return `COP ${price.toLocaleString('es-CO')}`;
}

const HomePage = () => {
  // No pasos needed anymore

  return (
    <div className='min-h-screen bg-principal-200'>
      <div className='relative'>
        <div className=''></div>
        <Header />
        
        {/* Sección de Rifas Disponibles */}
        <main className='container mx-auto px-4'>
          {/* La sección "Cómo Participar" ha sido eliminada */}
          
          {/* Sección: Rifas Disponibles */}
          <section className="py-10">
            <div className="container mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary text-center mb-8 relative">
                <span className="relative inline-block">
                  Rifas Disponibles
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded"></span>
                </span>
              </h2>
              <RafflesSection />
            </div>
          </section>

          {/* Sección: CTA Final */}
          <section className="py-12 my-10 bg-principal-300/50 rounded-lg relative overflow-hidden border border-principal-400/30 shadow-sm">
            <div className="container mx-auto px-4 relative z-10 text-center">
              <h2 className="text-2xl md:text-3xl font-medium text-secondary mb-4">
                ¡No pierdas la oportunidad de ganar!
              </h2>
              <p className="text-base text-secondary-700 mb-6 max-w-2xl mx-auto">
                Participa ahora en nuestras rifas y podrías ser el próximo ganador de premios increíbles.
              </p>
              <Link
                href="/rifa/1"
                className="inline-block px-6 py-3 bg-accent text-white font-medium rounded hover:bg-accent/90 transition-all duration-300 shadow-sm text-base"
              >
                Comprar boleto
              </Link>
              <p className="text-secondary-600 text-sm mt-3">
                Precios desde {formatCOP(5000)} por boleto
              </p>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default HomePage
