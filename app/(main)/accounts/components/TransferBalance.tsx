'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'
import { ArrowLeftRight } from 'lucide-react'

import { transferOpenAtom } from '@/app/(main)/accounts/components/store'
import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import { accountTypeAtom } from '@/app/stores/accountType'

import { TransferDto } from '@/app/dto/TransferDto'
import { transferBalanceSchema } from '@/app/zod/transferBalance.schema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AccountType } from '@/types/account'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

const TransferBalance = () => {
  const fromAccountId = useAtomValue(accountTypeAtom)
  const [isTransferOpen, setIsTransferOpen] = useAtom(transferOpenAtom)
  const queryClient = useQueryClient()

  const { data: accountTypes } = useQuery({
    queryKey: ['accountTypes'],
    queryFn: () => AccountTypeApiService.getUserAccountTypes(),
  })

  const { data: allAccounts } = useQuery({
    queryKey: ['accountTypes'],
    queryFn: () => AccountTypeApiService.getUserAccountTypes(),
  })

  const transferBalanceForm = useForm<z.infer<typeof transferBalanceSchema>>({
    resolver: zodResolver(transferBalanceSchema),
    defaultValues: { amount: 0, fromAccountId: 0, note: '', toAccountId: 0 },
  })

  const transferMutation = useMutation({
    mutationFn: (data: TransferDto) => AccountTypeApiService.transferBalance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountTypes'] })
      queryClient.invalidateQueries({ queryKey: ['accountType', fromAccountId] })
      setIsTransferOpen(false)
      transferBalanceForm.reset()
    },
  })

  function onSubmit(values: z.infer<typeof transferBalanceSchema>) {
    transferMutation.mutate(values as TransferDto)
  }

  const filterAccountsBy = (accounts: AccountType[], id: number) => {
    return accounts.filter((acc) => acc.id !== id)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Transfer Balance</CardTitle>
        <CardDescription>Move funds to another account</CardDescription>
      </CardHeader>

      <CardContent>
        <Dialog
          open={isTransferOpen}
          onOpenChange={() => {
            setIsTransferOpen(!isTransferOpen)
            transferBalanceForm.reset()
          }}
        >
          <DialogTrigger asChild>
            <Button disabled={accountTypes?.length === 0} className="w-full">
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Transfer Funds
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transfer Balance</DialogTitle>
              <DialogDescription>Transfer funds from this account to another account</DialogDescription>
            </DialogHeader>

            <Form {...transferBalanceForm}>
              <form onSubmit={transferBalanceForm.handleSubmit(onSubmit)} className="space-y-4">
                {/* FROM AND TO ACCOUNTS */}
                <div className="flex gap-2 *:space-y- *:flex-1">
                  <FormField
                    control={transferBalanceForm.control}
                    name="fromAccountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Account</FormLabel>
                        <Select value={field.value ? String(field.value) : ''} onValueChange={(value) => field.onChange(Number(value))}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select account..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filterAccountsBy(allAccounts || [], transferBalanceForm.watch('toAccountId')).map((acc) => (
                              <SelectItem key={acc.id} value={String(acc.id)}>
                                {acc.name} (${acc.balance})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={transferBalanceForm.control}
                    name="toAccountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To Account</FormLabel>
                        <Select value={field.value ? String(field.value) : ''} onValueChange={(value) => field.onChange(Number(value))}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select account..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filterAccountsBy(allAccounts || [], transferBalanceForm.watch('fromAccountId')).map((acc) => (
                              <SelectItem key={acc.id} value={String(acc.id)}>
                                {acc.name} (${acc.balance})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* AMOUNT */}
                <FormField
                  control={transferBalanceForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          value={field.value === 0 ? '' : field.value}
                          onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* NOTE */}
                <FormField
                  control={transferBalanceForm.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note (optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add a note..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setIsTransferOpen(false)}>
                    Cancel
                  </Button>

                  <Button type="submit" disabled={transferMutation.isPending}>
                    {transferMutation.isPending ? 'Transferring...' : 'Transfer'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default TransferBalance
