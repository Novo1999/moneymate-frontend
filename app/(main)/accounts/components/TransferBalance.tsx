'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'
import { ArrowLeftRight } from 'lucide-react'

import { transferFormAtom, transferOpenAtom } from '@/app/(main)/accounts/components/store'
import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import { accountTypeAtom } from '@/app/stores/accountType'

import { TransferDto } from '@/app/dto/TransferDto'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const TransferBalance = () => {
  const fromAccountId = useAtomValue(accountTypeAtom)
  const [isTransferOpen, setIsTransferOpen] = useAtom(transferOpenAtom)
  const [transferForm, setTransferForm] = useAtom(transferFormAtom)
  const queryClient = useQueryClient()
  const { data: accountTypes } = useQuery({
    queryKey: ['accountTypes'],
    queryFn: () => AccountTypeApiService.getUserAccountTypes(),
  })
  const { data: allAccounts } = useQuery({
    queryKey: ['accountTypes'],
    queryFn: () => AccountTypeApiService.getUserAccountTypes(),
  })

  const transferMutation = useMutation({
    mutationFn: (data: TransferDto) => AccountTypeApiService.transferBalance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountTypes'] })
      queryClient.invalidateQueries({ queryKey: ['accountType', fromAccountId] })
      setIsTransferOpen(false)
      setTransferForm({ toAccountId: 0, amount: 0, description: '' })
    },
  })

  const handleTransferSubmit = () => {
    transferMutation.mutate(transferForm as TransferDto)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Transfer Balance</CardTitle>
        <CardDescription>Move funds to another account</CardDescription>
      </CardHeader>

      <CardContent>
        <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
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

            <div className="space-y-4">
              {/* TO ACCOUNT */}
              <div className="space-y-1.5">
                <Label>To Account</Label>
                <Select
                  value={transferForm.toAccountId ? String(transferForm.toAccountId) : ''}
                  onValueChange={(value) =>
                    setTransferForm({
                      ...transferForm,
                      toAccountId: Number(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allAccounts
                      ?.filter((acc) => acc.id !== fromAccountId)
                      .map((acc) => (
                        <SelectItem key={acc.id} value={String(acc.id)}>
                          {acc.name} (${acc.balance})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* AMOUNT */}
              <div className="space-y-1.5">
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={transferForm.amount}
                  onChange={(e) =>
                    setTransferForm({
                      ...transferForm,
                      amount: Number(e.target.value),
                    })
                  }
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1.5">
                <Label>Description (optional)</Label>
                <Textarea
                  placeholder="Add a note..."
                  value={transferForm.description}
                  onChange={(e) =>
                    setTransferForm({
                      ...transferForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTransferOpen(false)}>
                Cancel
              </Button>

              <Button onClick={handleTransferSubmit} disabled={!transferForm.toAccountId || transferForm.amount <= 0 || transferMutation.isPending}>
                {transferMutation.isPending ? 'Transferring...' : 'Transfer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default TransferBalance
