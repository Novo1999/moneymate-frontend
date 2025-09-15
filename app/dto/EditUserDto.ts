import { Currency } from '@/types/currency'

export interface EditUserDto {
  name?: string
  email?: string
  password?: string
  currency?: Currency
  firstDayOfWeek?: number
  firstDayOfMonth?: number
  viewMode?: string
}
