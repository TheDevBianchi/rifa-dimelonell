// app/layout.js
import { Heebo } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const heebo = Heebo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heebo'
})

export default function RootLayout({ children }) {
  return (
    <html lang='es'>
      <body className={ `${heebo.className} antialiased` } suppressHydrationWarning>
        { children }
      <Toaster />
      </body>
    </html>
  )
}