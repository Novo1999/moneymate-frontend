import z from 'zod'

const TransactionType = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const

export const TransactionSchema = z.object({
  money: z
    .number()
    .min(1, 'Amount is required')
    .refine((val) => val > 0, 'Amount must be greater than 0'),

  type: z.enum(TransactionType),

  category: z.string().min(1, 'Category is required'),

  createdAt: z.date(),
})
