'use client'

import { initAuthAtom } from '@/app/provider/actions/authActions'
import { authLoadingAtom, userAtom } from '@/app/stores/auth'
import { useAtomValue, useSetAtom } from 'jotai'
import { Loader } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initAuth = useSetAtom(initAuthAtom)
  const isLoading = useAtomValue(authLoadingAtom)
  const user = useAtomValue(userAtom)

  const router = useRouter()
  const pathname = usePathname()

  const publicRoutes = ['/login', '/signup']

  useEffect(() => {
    initAuth()
  }, [initAuth])

  useEffect(() => {
    if (!isLoading && !user && !publicRoutes.includes(pathname)) {
      router.replace('/login')
    }

    if (!isLoading && user && publicRoutes.includes(pathname)) {
      router.replace('/')
    }
  }, [isLoading, user, pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-[90vh] flex justify-center items-center">
        <Loader className="animate-spin size-24 text-green-500" />
      </div>
    )
  }

  return <>{children}</>
}
