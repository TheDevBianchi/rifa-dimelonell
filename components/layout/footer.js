import Image from 'next/image'
import Link from 'next/link'

function footer () {
  return (
    <footer className='mt-12'>
      <div className='bg-principal-200 flex flex-col items-center justify-center w-full py-8'>
        <div className='max-w-[200px] mb-4'>
          <Image
            src='/logo.webp'
            alt='Logo rifa con jirvin'
            width={2835}
            height={2835}
            className='w-full h-auto'
            priority
          />
        </div>
        <h2 className='text-lg font-medium text-secondary mb-4'>REDES SOCIALES</h2>
        <div className='flex items-center justify-center gap-6'>
          <Link
            href='https://www.facebook.com/profile.php?id=61574174905201'
            className='text-secondary hover:text-accent transition-colors'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image src='/facebook.svg' alt='Facebook' width={32} height={32} />
          </Link>
          <Link
            href='https://www.instagram.com/jirvin.flores'
            className='text-secondary hover:text-accent transition-colors'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              src='/instagram.svg'
              alt='Instagram'
              width={32}
              height={32}
            />
          </Link>
          <Link
            href='https://wa.me/584248719024'
            className='text-secondary hover:text-accent transition-colors'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image src='/whatsapp.svg' alt='WhatsApp' width={32} height={32} />
          </Link>
          <Link
            href='https://www.tiktok.com/@jirvinflores'
            className='text-secondary hover:text-accent transition-colors'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image src='/tiktok.svg' alt='TikTok' width={32} height={32} />
          </Link>
        </div>
        <div className='mt-6 text-xs text-secondary-600'>
          © {new Date().getFullYear()} Dimelonell - Todos los derechos reservados
        </div>
      </div>
    </footer>
  )
}

export default footer
