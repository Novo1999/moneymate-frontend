'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const publicRoutes = ['/login', '/signup']
    const isPublicRoute = publicRoutes.includes(pathname)

    if (token && isPublicRoute) {
      router.replace('/')
    } else if (!token && !isPublicRoute && pathname !== '/') {
      router.replace('/login')
    } else if (!token && pathname === '/') {
      router.replace('/login')
    }
  }, [pathname, router])

  return <>{children}</>
}
