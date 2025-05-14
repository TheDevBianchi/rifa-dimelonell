// components/layout/sidebar.js
'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Gift, Settings, LogOut, Menu, X, Users, BarChart, ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/use-auth-store'
import { useRouter } from 'next/navigation'

const Sidebar = () => {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const { signOut } = useAuthStore()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const routes = [
    {
      icon: Home,
      href: '/dashboard',
      label: 'Dashboard'
    },
    {
      icon: Gift,
      href: '/dashboard/rifas',
      label: 'Rifas'
    },
    {
      icon: Users,
      href: '/dashboard/users',
      label: 'Usuarios'
    },
    {
      icon: ShoppingCart,
      href: '/dashboard/compras',
      label: 'Compras'
    },
    {
      icon: BarChart,
      href: '/dashboard/ranking',
      label: 'Ranking'
    },
    {
      icon: Settings,
      href: '/dashboard/settings',
      label: 'Configuración'
    }
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/auth/sign-in')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className='sticky inset-0 z-50'>
      {/* Mobile Menu Button */}
      <Button
        variant='ghost'
        size='icon'
        className='md:hidden p-2 text-secondary hover:bg-accent/20 hover:text-accent transition-colors'
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className='h-6 w-6' />
        ) : (
          <Menu className='h-6 w-6' />
        )}
      </Button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className='fixed inset-0 bg-secondary/80 backdrop-blur-sm z-40 md:hidden'
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-principal-200 backdrop-blur-xl border-r border-secondary shadow-md transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className='flex h-screen flex-col justify-between space-y-4'>
          <div className='flex flex-col space-y-2 p-4'>
            {/* Logo y título */}
            <div className='flex h-16 items-center border-b border-secondary px-6'>
              <h1 className='text-2xl font-bold text-accent-500'>
                DimeloNell
              </h1>
            </div>

            {/* Navegación */}
            <div className='space-y-2 mt-4'>
              {routes.map(route => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    'flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300',
                    'hover:bg-accent/10 hover:text-accent',
                    pathname === route.href
                      ? 'bg-accent text-white shadow-md'
                      : 'text-secondary'
                  )}
                >
                  <route.icon
                    className={cn(
                      'h-5 w-5',
                      pathname === route.href
                        ? 'text-white'
                        : 'text-secondary-600 group-hover:text-accent'
                    )}
                  />
                  {route.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Botón de cerrar sesión */}
          <div className='mt-auto p-4 border-t border-secondary'>
            <Button
              variant='ghost'
              className='w-full justify-start text-secondary-600 hover:text-accent hover:bg-accent/10'
              onClick={handleSignOut}
            >
              <LogOut className='h-5 w-5 mr-2' />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
