import { EditUserDto } from '@/app/dto/EditUserDto'
import axiosInstance from '@/lib/axios'
import { toast } from 'sonner'

export default class UserApiService {
  static async getCurrentUser() {
    try {
      const response = await axiosInstance.get('/auth/me')
      return response.data.data
    } catch (error: any) {
      throw error
    }
  }

  static async editUser(id: number, payload: EditUserDto) {
    try {
      const response = await axiosInstance.patch(`/auth/user/${id}`, payload)

      return response.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.msg || 'Failed to edit user'
      toast.error(errorMessage)
      throw error
    }
  }
}
