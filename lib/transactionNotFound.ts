import { TransactionFilter } from '@/types/transaction'

const getTransactionNotFoundText = (transactionFilters: TransactionFilter) => transform(transactionFilters)

export default getTransactionNotFoundText

const transform = (obj: Record<string, unknown>): string => {
  return Object.entries(obj)
    .flatMap(([key, value]) => {
      if (value == null || value === '') return []

      if (Array.isArray(value)) {
        return value.map((v) => `(${key} : ${v})`)
      }

      if (typeof value === 'object') {
        return transform(value as Record<string, unknown>)
      }

      return `(${key} : ${value})`
    })
    .join(', ')
}
