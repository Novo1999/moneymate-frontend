import { z } from 'zod'

export const addAccountTypeSchema = z.object({
  name: z.string().min(2, 'Account name must be at least 2 characters').max(50, 'Account name is too long'),
  balance: z.number().min(0, 'Balance cannot be negative').optional(),
})

export type AddAccountTypeSchema = z.infer<typeof addAccountTypeSchema>
