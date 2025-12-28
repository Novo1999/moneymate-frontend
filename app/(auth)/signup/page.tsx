'use client'

import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import AuthApiService from '@/app/ApiService/AuthApiService'
import { useAuth } from '@/app/hooks/use-auth'
import { updateUserAtom } from '@/app/provider/actions/authActions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Currency, getCurrencyDisplayName, getCurrencyFromCountryCode } from '@/types/currency'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
    currency: z.nativeEnum(Currency),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const updateUser = useSetAtom(updateUserAtom)

  const { login } = useAuth()
  const router = useRouter()

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      currency: Currency.USD,
    },
  })

  useEffect(() => {
    const detectCurrency = async () => {
      const apiKey = process.env.NEXT_PUBLIC_IP_API_KEY
      if (!apiKey) return

      try {
        const res = await fetch(`http://api.ipapi.com/check?access_key=${apiKey}&format=1`)
        const data = await res.json()
        console.log('🚀 ~ detectCurrency ~ data:', data)

        // Use getCurrencyFromCountryCode instead of getCurrencyDisplayName
        const currency = getCurrencyFromCountryCode(data?.country_code)
        console.log('🚀 ~ detectCurrency ~ currency:', currency)

        if (currency) {
          form.setValue('currency', currency)
        }
      } catch (error) {
        console.error('Failed to detect currency:', error)
      }
    }

    detectCurrency()
  }, [form])

  const onSubmit = async (data: SignupFormData) => {
    setError('')
    setIsLoading(true)

    try {
      // Create account
      await AuthApiService.register(data.name, data.email, data.password, data.currency)

      // Auto-login after successful signup
      const response = await login({
        email: data.email,
        password: data.password,
      })
      await AccountTypeApiService.addUserAccountType({ name: 'Cash', balance: 0 })
      updateUser({ currency: response.currency })

      queryClient.invalidateQueries({ queryKey: ['accountTypes'] })
      router.push('/')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { msg?: string } } }
      setError(error?.response?.data?.msg || 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">$</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">MoneyMate</h1>
            <p className="text-muted-foreground">Create your account</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter your full name" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your password" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-lg border border-destructive/20">{error}</div>}
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-72">
                        {Object.values(Currency).map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {getCurrencyDisplayName(currency)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
