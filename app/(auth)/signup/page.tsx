'use client'

import CurrencyPicker from '@/app/(auth)/signup/components/CurrencyPicker'
import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import { useAuth } from '@/app/hooks/use-auth'
import { DynamicPageForm } from '@/app/zod/auth.schema'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

export default function SignupPage() {
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const router = useRouter()

  const { registerAsync, loginAsync, updateUser, isRegistering, isLoggingIn } = useAuth()

  const form = useFormContext<DynamicPageForm>()

  const onSubmit = async (data: DynamicPageForm) => {
    if (data.pageType !== 'signup') return
    setError('')

    try {
      await registerAsync({
        name: data.name,
        email: data.email,
        password: data.password,
        currency: data.currency,
      })

      const loginResponse = await loginAsync({
        email: data.email,
        password: data.password,
      })

      const addUserAccountResponse = await AccountTypeApiService.addUserAccountType({
        name: 'Cash',
        balance: 0,
      })

      updateUser({
        id: loginResponse?.id,
        currency: data.currency,
        activeAccountTypeId: addUserAccountResponse?.data?.id,
      })

      queryClient.invalidateQueries({ queryKey: ['accountTypes'] })
      router.push('/')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { msg?: string } } }
      setError(error?.response?.data?.msg || 'Signup failed')
    }
  }

  const isLoading = isRegistering || isLoggingIn

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

              <CurrencyPicker />

              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center flex justify-center items-center">
            <p className="text-sm text-muted-foreground">Already have an account? </p>
            <Button variant="link" className="p-1">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
