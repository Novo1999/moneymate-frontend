import { CategoryDto } from '@/app/dto/CategoryDto'
import { DataResponse } from '@/app/dto/DataResponse'
import { handleApiError } from '@/lib/api'
import axiosInstance from '@/lib/axios'
import { toast } from 'sonner'

export default class CategoryApiService {
  static async getAllCategories() {
    try {
      const response = await axiosInstance.get<DataResponse<CategoryDto[]>>('/categories')

      return response.data.data.sort((a, b) => (a?.id || 0) - (b?.id || 0))
    } catch (error) {
      handleApiError(error, 'Failed to fetch all categories')
    }
  }

  static async getCategoryById(id: number) {
    try {
      const response = await axiosInstance.get(`/categories/${id}`)

      return response.data.data
    } catch (error) {
      handleApiError(error, 'Failed to fetch category')
    }
  }

  static async getUserCategories(userId: number) {
    try {
      const response = await axiosInstance.get('/categories/user', {
        params: { userId },
      })

      return response.data.data
    } catch (error) {
      handleApiError(error, 'Failed to fetch user categories')
    }
  }

  static async addCategory(categoryData: CategoryDto) {
    try {
      const response = await axiosInstance.post('/categories/add', categoryData)

      toast.success('Category added successfully!')
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to add category')
    }
  }

  static async editCategory(id: number, categoryData: Partial<CategoryDto>) {
    try {
      const response = await axiosInstance.patch(`/categories/edit/${id}`, categoryData)

      toast.success('Category updated successfully!')
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to update category')
    }
  }

  static async deleteCategory(id: number) {
    try {
      const response = await axiosInstance.delete(`/categories/delete/${id}`)

      toast.success('Category deleted successfully!')
      return response.data
    } catch (error) {
      handleApiError(error, 'Failed to delete category')
    }
  }
}
