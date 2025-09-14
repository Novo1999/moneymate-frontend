'use client'

import AuthApiService from '@/app/ApiService/AuthApiService'
import UserApiService from '@/app/ApiService/UserApiService'
import { UserDto } from '@/app/dto/UserDto'
import Cookies from 'js-cookie'
import { Loader } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  user: UserDto | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  setUser: Dispatch<SetStateAction<UserDto | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const publicRoutes = ['/login', '/signup']
  useEffect(() => {
    const storedToken = Cookies.get('accessToken')

    if (storedToken) {
      setToken(storedToken)
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]))

        UserApiService.getUser(payload.id)
          .then((res) => {
            if (res?.data) {
              const userData = res.data
              setUser(userData)

              // If user is logged in and on login/signup page, redirect to home
              if (publicRoutes.includes(pathname)) {
                router.replace('/')
              }
            }
            setIsLoading(false)
          })
          .catch((error) => {
            console.error('Failed to fetch user:', error)
            Cookies.remove('accessToken')
            setToken(null)
            if (!publicRoutes.includes(pathname)) {
              router.replace('/login')
            }
            setIsLoading(false)
          })
      } catch (error) {
        console.error('Failed to decode token:', error)
        Cookies.remove('accessToken')
        setToken(null)
        if (!publicRoutes.includes(pathname)) {
          router.replace('/login')
        }
        setIsLoading(false)
      }
    } else {
      // No token, redirect to login if not on public routes
      if (!publicRoutes.includes(pathname)) {
        router.replace('/login')
      }
      setIsLoading(false)
    }
  }, [router, pathname])

  const login = async (email: string, password: string) => {
    try {
      const accessToken = await AuthApiService.login(email, password)

      Cookies.set('accessToken', accessToken, {
        expires: 1,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })

      setToken(accessToken)

      const payload = JSON.parse(atob(accessToken.split('.')[1]))
      setUser(payload)

      router.push('/')
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
    setUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className="min-h-[90vh] flex justify-center items-center">
          <Loader className="animate-spin size-24" />
        </div>
      ) : (
        // Only render children when user is logged in OR on public routes
        (user || publicRoutes.includes(pathname)) && children
      )}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
