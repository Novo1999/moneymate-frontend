import { Currency } from '@/types/currency'
import { z } from 'zod'

const baseSchema = z.object({
  id: z.string(),
  pageType: z.enum(['login', 'signup']),
})

const loginSchema = baseSchema.extend({
  pageType: z.literal('login'),
  email: z.email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signupSchema = baseSchema
  .extend({
    pageType: z.literal('signup'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
    currency: z.enum(Currency),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const dynamicPageSchema = z.discriminatedUnion('pageType', [loginSchema, signupSchema])
export type DynamicPageForm = z.infer<typeof dynamicPageSchema>
export type LoginForm = z.infer<typeof loginSchema>
export type SignupForm = z.infer<typeof signupSchema>
