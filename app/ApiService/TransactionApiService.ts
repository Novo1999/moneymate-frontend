import { DataResponse } from '@/app/dto/DataResponse'
import { handleApiError } from '@/lib/api'
import axiosInstance from '@/lib/axios'
import { ExpenseCategory, IncomeCategory } from '@/types/categories'
import { TransactionResponse, TransactionResponsePaginated } from '@/types/response'
import { TransactionType } from '@/types/transaction'
import { toast } from 'sonner'

export default class TransactionApiService {
  static async getAllTransactions() {
    try {
      const response = await axiosInstance.get('/transaction')

      return response.data.data
    } catch (error) {
      handleApiError(error, 'Failed to fetch all transactions')
    }
  }

  static async getUserTransactions(accountTypeId: number, from: string, to: string) {
    try {
      const response = await axiosInstance.get('/transaction/user', {
        params: { accountTypeId, from, to },
      })

      return response.data.data
    } catch (error) {
      handleApiError(error, 'Failed to fetch user transactions')
    }
  }

  static async getUserTransactionsPaginated(accountTypeId: number, cursor: number, limit: number, category?: IncomeCategory | ExpenseCategory | '', type?: TransactionType['type'] | "") {
    const filters: Record<string, unknown> = {}

    if (category) {
      filters.category = category
    }
    if (type) {
      filters.type = type
    }

    try {
      const response = await axiosInstance.get<DataResponse<TransactionResponsePaginated>>('/transaction/paginated', {
        params: { accountTypeId, limit, ...filters, ...(cursor ? { cursor } : {}) },
      })

      return response.data.data
    } catch (error) {
      handleApiError(error, 'Failed to fetch user transactions')
    }
  }

  static async getUserTransactionsInfo(accountTypeId: number, from: string, to: string) {
    try {
      const response = await axiosInstance.get<{
        data: TransactionResponse
      }>(`/transaction/info`, {
        params: { accountTypeId, from, to },
      })

      return response.data.data
    } catch (error) {
      handleApiError(error, 'Failed to fetch transaction info')
    }
  }

  static async addTransaction(transactionData: { category: string; money: number; type: 'income' | 'expense'; userId?: number; accountTypeId?: number; createdAt?: string }) {
    try {
      const response = await axiosInstance.post('/transaction/add', transactionData)

      toast.success('Transaction added successfully!')
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to add transaction')
    }
  }

  static async editTransaction(
    id: number,
    transactionData: {
      category?: string
      money?: number
      type?: 'income' | 'expense'
      createdAt?: string
    },
  ) {
    try {
      const response = await axiosInstance.patch(`/transaction/edit/${id}`, transactionData)

      toast.success('Transaction updated successfully!')
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to update transaction')
    }
  }

  static async deleteTransaction(id: number) {
    try {
      const response = await axiosInstance.delete(`/transaction/delete/${id}`)

      toast.success('Transaction deleted successfully!')
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to delete transaction')
    }
  }
}
