import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const { pathname } = request.nextUrl

  console.log('[MIDDLEWARE] Cookies:', request.cookies.getAll())
  console.log('[MIDDLEWARE] Path:', pathname)
  console.log('[MIDDLEWARE] Token exists:', Boolean(token))

  const publicRoutes = ['/login', '/signup']
  const isPublicRoute = publicRoutes.includes(pathname)

  console.log('[MIDDLEWARE] Is public route:', isPublicRoute)

  if (token && isPublicRoute) {
    console.log('[MIDDLEWARE] Logged in user tried to access public route → redirecting to /')
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!token && !isPublicRoute && pathname !== '/') {
    console.log('[MIDDLEWARE] Unauthenticated user tried to access protected route → redirecting to /login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (!token && pathname === '/') {
    console.log('[MIDDLEWARE] Unauthenticated user tried to access home → redirecting to /login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  console.log('[MIDDLEWARE] Access allowed → proceeding')
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
