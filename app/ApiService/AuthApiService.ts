import { handleApiError } from '@/lib/api'
import axiosInstance from '@/lib/axios'
import { toast } from 'sonner'

export default class AuthApiService {
  static async login(email: string, password: string) {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      })

      const { accessToken, refreshToken, ...userData } = response.data.data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      toast.success('Login successful!')
      return userData
    } catch (error) {
      handleApiError(error, 'Login failed')
    }
  }

  static async register(name: string, email: string, password: string, currency: string) {
    try {
      const response = await axiosInstance.post('/auth/signUp', {
        name,
        email,
        password,
        currency,
      })

      toast.success('Account created successfully!')
      return response.data
    } catch (error) {
      handleApiError(error, 'Registration failed')
    }
  }

  static async logout() {
    try {
      const response = await axiosInstance.post('/auth/logout')
      toast.success('Logged out successfully!')
      return response.data
    } catch (error) {
      handleApiError(error, 'Logout failed')
    }
  }

  static async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await axiosInstance.post('/auth/refreshToken', {
        refreshToken,
      })

      const { accessToken, refreshToken: newRefreshToken } = response.data.data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)

      return accessToken
    } catch (error) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      handleApiError(error, 'Failed to refresh token')
      throw error
    }
  }
}
