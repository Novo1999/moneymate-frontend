'use client'

import { useAtom, useAtomValue } from 'jotai'
import { ArrowLeftRight } from 'lucide-react'

import { transferFormAtom, transferOpenAtom } from '@/app/(main)/accounts/page'
import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import { accountTypeAtom } from '@/app/stores/accountType'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const TransferBalance = () => {
  const accountTypeId = useAtomValue(accountTypeAtom)
  const [isTransferOpen, setIsTransferOpen] = useAtom(transferOpenAtom)
  const [transferForm, setTransferForm] = useAtom(transferFormAtom)
  const { data: allAccounts } = useQuery({
    queryKey: ['accountTypes'],
    queryFn: async () => await AccountTypeApiService.getUserAccountTypes(),
  })
  const queryClient = useQueryClient()

  const transferMutation = useMutation({
    mutationFn: (transferData: any) =>
      AccountTypeApiService.transferBalance({
        fromAccountId: accountTypeId || 0,
        ...transferData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountType', accountTypeId] })
      queryClient.invalidateQueries({ queryKey: ['accountTypes'] })
      setIsTransferOpen(false)
      setTransferForm({ toAccountId: 0, amount: 0, description: '' })
    },
  })

  const handleTransferSubmit = () => {
    transferMutation.mutate(transferForm)
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
            <Button className="w-full">
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
              <div>
                <Label htmlFor="toAccount">To Account</Label>
                <select
                  id="toAccountId"
                  className="w-full mt-1.5 px-3 py-2 border rounded-md"
                  value={transferForm.toAccountId}
                  onChange={(e) =>
                    setTransferForm({
                      ...transferForm,
                      toAccountId: Number(e.target.value),
                    })
                  }
                >
                  <option value={0}>Select account...</option>
                  {allAccounts
                    ?.filter((acc) => acc.id !== accountTypeId)
                    .map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} (${acc.balance})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
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

              <div>
                <Label htmlFor="transferDesc">Description (Optional)</Label>
                <Textarea
                  id="transferDesc"
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

              <Button onClick={handleTransferSubmit} disabled={!transferForm.toAccountId || transferForm.amount <= 0}>
                Transfer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default TransferBalance
