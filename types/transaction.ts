import { ExpenseCategory, IncomeCategory } from '@/types/categories'

type TransactionType = {
  id: number
  money: string
  note: string | null
  type: 'income' | 'expense'
  category: IncomeCategory | ExpenseCategory
  createdAt: string
}

type TransactionModalState = {
  open: boolean
  data: Partial<TransactionType>
}

type TransactionFilter = {
  category?: IncomeCategory | ExpenseCategory | string
  type?: TransactionType['type'] | ''
  money?: { min: number; max: number }
}

export type { TransactionFilter, TransactionModalState, TransactionType }
