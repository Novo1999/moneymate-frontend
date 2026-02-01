import { TransactionType } from '@/types/transaction'

type TransactionResponse = {
  count: number
  transactions: TransactionType[]
}

export type { TransactionResponse }
