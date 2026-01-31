'use client'

import { useAuth } from '@/app/hooks/use-auth'
import { AuthGuard } from '@/components/shared/AuthGuard'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuth()

  return <AuthGuard>{children}</AuthGuard>
}
