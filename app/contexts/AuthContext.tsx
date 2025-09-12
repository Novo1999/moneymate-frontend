'use client'

import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  email: string
  id: number
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedToken = Cookies.get('accessToken')
    if (storedToken) {
      setToken(storedToken)
      // Decode JWT to get user info (you might want to add a library like jwt-decode)
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]))
        setUser({ email: payload.email, id: payload.id })
      } catch (error) {
        console.error('Failed to decode token:', error)
        Cookies.remove('accessToken')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      })

      const { token: accessToken } = response.data.data

      Cookies.set('accessToken', accessToken, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })

      setToken(accessToken)

      // Decode JWT to get user info
      const payload = JSON.parse(atob(accessToken.split('.')[1]))
      setUser({ email: payload.email, id: payload.id })
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = () => {
    Cookies.remove('accessToken')
    setToken(null)
    setUser(null)
    router.replace('/login')
  }

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
