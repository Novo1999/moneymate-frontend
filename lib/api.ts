import { ApiErrorResponse } from '@/types/error'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

const handleApiError = (error: unknown, fallbackMessage: string): never => {
  const axiosError = error as AxiosError<ApiErrorResponse>
  const errorMessage = axiosError?.response?.data?.msg || fallbackMessage
  toast.error(errorMessage)
  throw error
}

export { handleApiError }
