'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import { AddAccountTypeSchema, addAccountTypeSchema } from '@/app/zod/addAccountType.schema'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

const AddAccountTypeForm = () => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const form = useForm<AddAccountTypeSchema>({
    resolver: zodResolver(addAccountTypeSchema),
    defaultValues: {
      name: '',
      balance: 0,
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: AddAccountTypeSchema) => AccountTypeApiService.addUserAccountType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountTypes'] })
      form.reset()
      setOpen(false)
    },
  })

  const onSubmit = (values: AddAccountTypeSchema) => {
    mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add Account Type
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Account Type</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Savings, Cash, Bank..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Balance (optional)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="0.01" {...field} onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Creating...' : 'Create Account'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddAccountTypeForm
