'use client'

import { markedAccountAtom } from '@/app/(main)/accounts/components/store'
import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import { userAtom } from '@/app/stores/auth'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { AccountType } from '@/types/account'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'
import { Trash2, Wallet } from 'lucide-react'
const Account = ({ accountType }: { accountType: AccountType }) => {
  const user = useAtomValue(userAtom)
  const queryClient = useQueryClient()
  const [markedAccounts, setMarkedAccount] = useAtom(markedAccountAtom)

  const handleCheckAccount = () => {
    setMarkedAccount((prev) => (prev.some((at) => at.id === accountType?.id) ? prev.filter((at) => at.id !== accountType.id) : [...prev, accountType]))
  }

  const { mutate, isPending } = useMutation({
    mutationFn: () => AccountTypeApiService.deleteUserAccountType(accountType.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountTypes'] })
      setMarkedAccount((prev) => prev.filter((at) => at.id !== accountType.id))
    },
  })

  const isChecked = markedAccounts.some((at) => at.id === accountType.id)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Checkbox checked={isChecked} onCheckedChange={handleCheckAccount} />
          <Wallet className="w-5 h-5" />
          {accountType.name}
        </CardTitle>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete account type?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone. All data associated with this account will be permanently removed.</AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className='w-full sm:w-fit' onClick={() => mutate()} disabled={isPending}>
                {isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      <CardContent>
        <div className="text-4xl font-bold">
          {user?.currency}{' '}
          {parseFloat(accountType.balance || '0').toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default Account
