'use client'

import { useAuth } from '@/app/hooks/use-auth'
import { DynamicPageForm } from '@/app/zod/auth.schema'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useFormContext } from 'react-hook-form'

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth()

  const form = useFormContext<DynamicPageForm>()

  const onSubmit = (data: DynamicPageForm) => {
    if (data.pageType !== 'login') return

    login(
      {
        email: data.email,
        password: data.password,
      },
      {
        onError: (err) => form.setError('root', { message: err.response.data.msg }),
      },
    )
  }

  const loginError = form.formState.errors.root?.message

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

              {loginError && <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-lg border border-destructive/20">{loginError}</div>}

              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" disabled={isLoggingIn}>
                {isLoggingIn ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-foreground font-medium mb-1">Demo Credentials</p>
              <p className="text-sm text-muted-foreground">novo12@gmail.com / password</p>
            </div>
            <div className="mt-6 text-center flex justify-center items-center">
              <p className="text-sm text-muted-foreground">Don&apos;t have an account? </p>
              <Button variant="link" className="p-1">
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
