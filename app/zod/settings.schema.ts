import { Currency } from '@/types/currency'
import { z } from 'zod'

export const settingsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  currency: z.nativeEnum(Currency),
  firstDayOfWeek: z.number().min(0).max(6),
  firstDayOfMonth: z.number().min(1).max(31),
})

export type SettingsValues = z.infer<typeof settingsSchema>
