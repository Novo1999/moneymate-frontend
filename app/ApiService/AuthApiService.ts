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
      return response.data.data.token
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Login failed'
      toast.error(errorMessage)
      throw error
    }
  }

  static async register(name: string, email: string, password: string) {
    try {
      const response = await axiosInstance.post('/auth/register', {
        name,
        email,
        password,
      })

      toast.success('Account created successfully!')
      return response.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Registration failed'
      toast.error(errorMessage)
      throw error
    }
  }

  static async getUser(id: number) {
    try {
      const response = await axiosInstance.get(`/auth/user/${id}`)

      return response.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to fetch user'
      toast.error(errorMessage)
      throw error
    }
  }
}
