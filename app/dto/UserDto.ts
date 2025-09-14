import { Currency } from '@/types/currency'

export interface UserDto {
  id: number
  name: string
  email: string
  currency: Currency
  firstDayOfWeek: number
  firstDayOfMonth: number
  viewMode: string
}
