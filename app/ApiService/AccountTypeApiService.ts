import axiosInstance from '@/lib/axios'
import { toast } from 'sonner'

export default class AccountTypeApiService {
  static async getUserAccountTypes() {
    try {
      const response = await axiosInstance.get('/accountType')

      return response.data.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.msg || 'Failed to fetch account types'
      toast.error(errorMessage)
      throw error
    }
  }
  static async getUserAccountType(id: number) {
    try {
      const response = await axiosInstance.get(`/accountType/${id}`)

      return response.data.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.msg || 'Failed to fetch account type'
      toast.error(errorMessage)
      throw error
    }
  }

  static async addUserAccountType(accountTypeData: { name: string; type: string; balance?: number; description?: string }) {
    try {
      const response = await axiosInstance.post('/accountType/add', accountTypeData)

      toast.success('Account type added successfully!')
      return response.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.msg || 'Failed to add account type'
      toast.error(errorMessage)
      throw error
    }
  }

  static async editUserAccountType(
    id: number,
    accountTypeData: {
      name?: string
      type?: string
      balance?: number
      description?: string
    }
  ) {
    try {
      const response = await axiosInstance.patch(`/accountType/edit/${id}`, accountTypeData)

      toast.success('Account type updated successfully!')
      return response.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.msg || 'Failed to update account type'
      toast.error(errorMessage)
      throw error
    }
  }

  static async transferBalance(transferData: { fromAccountId: number; toAccountId: number; amount: number; description?: string }) {
    try {
      const response = await axiosInstance.patch('/accountType/transfer', transferData)

      toast.success('Balance transferred successfully!')
      return response.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.msg || 'Failed to transfer balance'
      toast.error(errorMessage)
      throw error
    }
  }

  static async deleteUserAccountType(id: number) {
    try {
      const response = await axiosInstance.delete(`/accountType/delete/${id}`)

      toast.success('Account type deleted successfully!')
      return response.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.msg || 'Failed to delete account type'
      toast.error(errorMessage)
      throw error
    }
  }
}
