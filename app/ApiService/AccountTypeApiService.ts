import { EditAccountDetailsDto } from '@/app/dto/EditAccountDetailsDto'
import { TransferDto } from '@/app/dto/TransferDto'
import axiosInstance from '@/lib/axios'
import { AccountType } from '@/types/account'
import { toast } from 'sonner'

export default class AccountTypeApiService {
  static async getUserAccountTypes() {
    try {
      const response = await axiosInstance.get<{ data: AccountType[] }>('/accountType')

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

  static async addUserAccountType(accountTypeData: { name: string; balance?: number }) {
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

  static async editUserAccountType(id: number, accountTypeData: EditAccountDetailsDto) {
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

  static async transferBalance(transferData: TransferDto) {
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
