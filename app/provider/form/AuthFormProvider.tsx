'use client'
import { DynamicPageForm, dynamicPageSchema } from '@/app/zod/auth.schema'
import { Currency } from '@/types/currency'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

const getDefaultValues = (pathname: string): DynamicPageForm => {
  if (pathname === '/login') {
    return {
      id: crypto.randomUUID(),
      pageType: 'login',
      email: '',
      password: '',
    }
  }

  return {
    id: crypto.randomUUID(),
    pageType: 'signup',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    currency: Currency.USD,
  }
}

export const AuthFormProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  const form = useForm<DynamicPageForm>({
    resolver: zodResolver(dynamicPageSchema),
    defaultValues: getDefaultValues(pathname),
  })

  // Reset form when pathname changes
  useEffect(() => {
    form.reset(getDefaultValues(pathname))
  }, [pathname, form])

  return <FormProvider {...form}>{children}</FormProvider>
}
