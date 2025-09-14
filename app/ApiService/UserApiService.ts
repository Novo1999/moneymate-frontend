import { DataResponse } from '@/app/dto/DataResponse'
import { EditUserDto } from '@/app/dto/EditUserDto'
import { UserDto } from '@/app/dto/UserDto'
import axiosInstance from '@/lib/axios'
import { toast } from 'sonner'

export default class UserApiService {
  static async getUser(id: number) {
    try {
      const response = await axiosInstance.get<DataResponse<UserDto>>(`/auth/user/${id}`)

      return response.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to fetch user'
      toast.error(errorMessage)
      throw error
    }
  }

  static async editUser(id: number, payload: EditUserDto) {
    try {
      const response = await axiosInstance.patch(`/auth/user/${id}`, payload)

      return response.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to edit user'
      toast.error(errorMessage)
      throw error
    }
  }
}
