'use client'

import { useAuth } from '@/app/hooks/use-auth'
import { settingsSchema, SettingsValues } from '@/app/zod/settings.schema'
import { Form } from '@/components/ui/form'
import { Currency } from '@/types/currency'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ReactNode, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface SettingsFormWrapperProps {
  children: ReactNode
}

export function SettingsFormWrapper({ children }: SettingsFormWrapperProps) {
  const { user, updateUserAsync } = useAuth()

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: '',
      currency: Currency.USD,
      firstDayOfWeek: 0,
      firstDayOfMonth: 1,
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        currency: user.currency || Currency.USD,
        firstDayOfWeek: user.firstDayOfWeek || 0,
        firstDayOfMonth: user.firstDayOfMonth || 1,
      })
    }
  }, [user, form])

  const { mutateAsync: saveChangesMutate } = useMutation({
    mutationFn: async (values: SettingsValues) => {
      if (!user?.id) return
      await updateUserAsync({ ...values, id: user.id })
    },
    onSuccess: () => toast.success('Changes saved.'),
    onError: () => toast.error('Failed to save changes.'),
  })

  const onSubmit = async (values: SettingsValues) => {
    await saveChangesMutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        {children}
      </form>
    </Form>
  )
}
