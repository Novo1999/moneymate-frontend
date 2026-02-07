'use client'

import CurrencyPicker from '@/app/(auth)/signup/components/CurrencyPicker'
import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import { useAuth } from '@/app/hooks/use-auth'
import { DynamicPageForm } from '@/app/zod/auth.schema'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useFormContext } from 'react-hook-form'

export function SignUpForm() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { registerAsync, loginAsync, updateUser, isRegistering, isLoggingIn } = useAuth()
  const form = useFormContext<DynamicPageForm>()

  const onSubmit = async (data: DynamicPageForm) => {
    if (data.pageType !== 'signup') return

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

      form.setError('root', {
        message: error?.response?.data?.msg || 'Signup failed',
      })
    }
  }

  const isLoading = isRegistering || isLoggingIn
  const rootError = form.formState.errors.root?.message

  return (
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

        {rootError && <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-lg border border-destructive/20">{rootError}</div>}

        <CurrencyPicker />

        <Button type="submit" className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </Form>
  )
}
