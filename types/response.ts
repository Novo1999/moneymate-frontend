import { TransactionType } from '@/types/transaction'

type TransactionResponse = {
  count: number
  transactions: TransactionType[]
}

type TransactionResponsePaginated = {
  transactions: TransactionType[]
  nextCursor: number
}

export type { TransactionResponse, TransactionResponsePaginated }

