import axiosInstance from '@/lib/axios'
import { toast } from 'sonner'

export default class AuthApiService {
  static async login(email: string, password: string) {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      })

      toast.success('Login successful!')
      return response.data.data
    } catch (error: any) {
      throw error
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
    } catch (error: any) {
      throw error
    }
  }
  static async logout() {
    try {
      const response = await axiosInstance.post('/auth/logout')
      toast.success('Logged out successfully!')
      return response.data
    } catch (error: any) {
      toast.error('Logout failed')
      throw error
    }
  }

  static async refreshToken() {
    try {
      const response = await axiosInstance.post('/auth/refreshToken')
      return response.data
    } catch (error: any) {
      toast.error('Failed to refresh token')
      throw error
    }
  }
}
