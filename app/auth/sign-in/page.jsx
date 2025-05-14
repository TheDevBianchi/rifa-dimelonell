'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/use-auth-store'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useEffect } from 'react'

const schema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export default function SignInPage () {
  const router = useRouter()
  const { signIn, user, loading, initializeAuth } = useAuthStore()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    // Inicializar la autenticación una sola vez
    const unsubscribe = initializeAuth()

    // Cleanup function
    return () => unsubscribe()
  }, [initializeAuth])

  useEffect(() => {
    // Solo redirigir si tenemos un usuario y no estamos cargando
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const onSubmit = async data => {
    try {
      await signIn(data.email, data.password)

      // Obtener el token del localStorage y guardarlo como cookie
      const token = localStorage.getItem('auth-token')
      if (token) {
        document.cookie = `auth-token=${token}; path=/; max-age=3600; secure; samesite=strict`
      }

      toast.success('Inicio de sesión exitoso')
      setTimeout(() => {
        router.refresh()
      }, 3000)
    } catch (error) {
      console.error(error)
      toast.error('Error al iniciar sesión', {
        description: 'Credenciales inválidas. Por favor, verifica tus datos.'
      })
    }
  }

  // Solo mostrar el loader cuando estamos en el estado inicial de carga
  if (loading) {
    return (
      <div className='min-h-screen bg-principal-200 flex items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-accent' />
      </div>
    )
  }

  return (
    <div
      className='min-h-screen bg-gradient-to-br from-principal-300 to-principal-200 flex items-center justify-center p-4'
      role='main'
      aria-labelledby='signin-title'
    >
      <div className='w-full max-w-md'>
        <div className='bg-principal-200 backdrop-blur-xl rounded-2xl shadow-md p-8 border border-secondary'>
          <h1
            id='signin-title'
            className='text-3xl font-bold text-secondary mb-8 text-center border-b border-secondary pb-2'
          >
            Iniciar Sesión
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6'
            noValidate
            aria-label='Formulario de inicio de sesión'
          >
            <div role='group' aria-labelledby='email-label'>
              <label
                id='email-label'
                htmlFor='email'
                className='block text-sm font-medium text-secondary mb-1.5'
              >
                Correo Electrónico
              </label>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type='email'
                    id='email'
                    autoComplete='email'
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className='mt-1 block w-full rounded-xl border-2 pl-3 py-2 bg-principal-300/40 border-secondary text-secondary shadow-sm 
                      focus:border-accent focus:ring-accent focus:ring-2 focus:ring-offset-1 focus:ring-offset-principal-200
                      placeholder:text-secondary-600 transition-all duration-200'
                    placeholder='tu@email.com'
                  />
                )}
              />
              {errors.email && (
                <p
                  id='email-error'
                  className='mt-2 text-sm text-accent'
                  role='alert'
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div role='group' aria-labelledby='password-label'>
              <label
                id='password-label'
                htmlFor='password'
                className='block text-sm font-medium text-secondary mb-1.5'
              >
                Contraseña
              </label>
              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type='password'
                    id='password'
                    autoComplete='current-password'
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? 'password-error' : undefined
                    }
                    className='mt-1 block w-full rounded-xl pl-3 py-2 border-2 bg-principal-300/40 border-secondary text-secondary shadow-sm 
                      focus:border-accent focus:ring-accent focus:ring-2 focus:ring-offset-1 focus:ring-offset-principal-200
                      placeholder:text-secondary-600 transition-all duration-200'
                    placeholder='••••••••'
                  />
                )}
              />
              {errors.password && (
                <p
                  id='password-error'
                  className='mt-2 text-sm text-accent'
                  role='alert'
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className='w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold
                text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-accent focus:ring-offset-principal-200 disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 shadow-md'
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    className='w-5 h-5 animate-spin mr-2'
                    aria-hidden='true'
                  />
                  <span>Iniciando sesión...</span>
                  <span className='sr-only'>Por favor espere</span>
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
