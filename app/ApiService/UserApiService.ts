import { EditUserDto } from '@/app/dto/EditUserDto'
import { handleApiError } from '@/lib/api'
import axiosInstance from '@/lib/axios'

export default class UserApiService {
  static async getCurrentUser() {
    try {
      const response = await axiosInstance.get('/auth/me')
      return response.data.data
    } catch (error) {
      handleApiError(error, 'Failed to get current user')
    }
  }

  static async editUser(id: number, payload: EditUserDto) {
    try {
      const response = await axiosInstance.patch(`/auth/user/${id}`, payload)

      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to edit user')
    }
  }
}
