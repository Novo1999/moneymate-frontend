import axiosInstance from '@/lib/axios'
import { toast } from 'sonner'

export default class TransactionApiService {
  static async getAllTransactions() {
    try {
      const response = await axiosInstance.get('/transaction')

      return response.data.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to fetch all transactions'
      toast.error(errorMessage)
      throw error
    }
  }

  static async getUserTransactions(accountTypeId: number, from: string, to: string) {
    try {
      const response = await axiosInstance.get('/transaction/user', {
        params: { accountTypeId, from, to },
      })

      return response.data.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to fetch user transactions'
      toast.error(errorMessage)
      throw error
    }
  }

  static async getUserTransactionsInfo(accountTypeId: number, from: string, to: string) {
    try {
      const response = await axiosInstance.get(`/transaction/info`, {
        params: { accountTypeId, from, to },
      })

      return response.data.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to fetch transaction info'
      toast.error(errorMessage)
      throw error
    }
  }

  static async addTransaction(transactionData: { category: string; money: number; type: 'income' | 'expense'; userId: number; accountTypeId: number; createdAt?: string }) {
    try {
      const response = await axiosInstance.post('/transaction/add', transactionData)

      toast.success('Transaction added successfully!')
      return response.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to add transaction'
      toast.error(errorMessage)
      throw error
    }
  }

  static async editTransaction(
    id: number,
    transactionData: {
      category?: string
      money?: number
      type?: 'income' | 'expense'
      createdAt?: string
    }
  ) {
    try {
      const response = await axiosInstance.patch(`/transaction/edit/${id}`, transactionData)

      toast.success('Transaction updated successfully!')
      return response.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to update transaction'
      toast.error(errorMessage)
      throw error
    }
  }

  static async deleteTransaction(id: number) {
    try {
      const response = await axiosInstance.delete(`/transaction/delete/${id}`)

      toast.success('Transaction deleted successfully!')
      return response.data
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to delete transaction'
      toast.error(errorMessage)
      throw error
    }
  }
}
