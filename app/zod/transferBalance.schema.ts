import { z } from 'zod'

export const transferBalanceSchema = z.object({
  fromAccountId: z.number().min(1, {error: "Must select account"}),
  toAccountId: z.number().min(1, {error: "Must select account"}),
  amount: z.number().min(1, { error: 'Amount must be greater than 0' }),
  note: z.string().optional(),
})

export type AddAccountTypeSchema = z.infer<typeof transferBalanceSchema>
