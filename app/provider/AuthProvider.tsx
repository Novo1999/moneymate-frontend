'use client'

import { useAuth } from '@/app/hooks/use-auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuth()

  return children
}
