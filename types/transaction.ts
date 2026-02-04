import { ExpenseCategory, IncomeCategory } from '@/types/categories'

export type TransactionType = {
  id: number
  money: string
  note: string | null
  type: 'income' | 'expense'
  category: IncomeCategory | ExpenseCategory
  createdAt: string
}

