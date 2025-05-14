import { NextResponse } from 'next/server'

export async function middleware (request) {
  const token = request.cookies.get('auth-token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')

  // Si no hay token y está intentando acceder al dashboard
  if (!token && isDashboardPage) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  // Si hay token y está intentando acceder a páginas de autenticación
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // En cualquier otro caso, permitir el acceso
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
}
