import AuthApiService from '@/app/ApiService/AuthApiService'
import axios from 'axios'
import { toast } from 'sonner'

const axiosInstance = axios.create({
  baseURL: '/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await AuthApiService.refreshToken()
        return axiosInstance(originalRequest)
      } catch (error) {
        toast.error('Session Expired. Please login again.')
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
