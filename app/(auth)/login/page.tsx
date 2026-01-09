'use client'

import { useAuth } from '@/app/hooks/use-auth'
import { DynamicPageForm } from '@/app/zod/auth.schema'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const router = useRouter()

  const form = useFormContext<DynamicPageForm>()

  const onSubmit = async (data: DynamicPageForm) => {
    if (data.pageType !== 'login') return
    setError('')
    setIsLoading(true)

    try {
      await login({
        email: data.email,
        password: data.password,
      })
      router.push('/')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { msg?: string } } }
      setError(error?.response?.data?.msg || 'Login failed')
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
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              {error && <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-lg border border-destructive/20">{error}</div>}

              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-foreground font-medium mb-1">Demo Credentials</p>
              <p className="text-sm text-muted-foreground">novo12@gmail.com / password</p>
            </div>
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link onClick={() => form.clearErrors()} href="/signup" className="text-green-600 hover:text-green-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
