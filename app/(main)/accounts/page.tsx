'use client'
import AccountDetails from '@/app/(main)/accounts/components/AccountDetails'
import CurrentAccount from '@/app/(main)/accounts/components/CurrentAccount'
import EditAccountDetails from '@/app/(main)/accounts/components/EditAccountDetails'
import TransferBalance from '@/app/(main)/accounts/components/TransferBalance'
import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import { accountTypeAtom } from '@/app/stores/accountType'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { atom, useAtomValue } from 'jotai'

export const transferOpenAtom = atom<boolean>(false)

export const transferFormAtom = atom({
  toAccountId: 0,
  amount: 0,
  description: '',
})

const AccountsPage = () => {
  const accountTypeId = useAtomValue(accountTypeAtom)

  const { isLoading } = useQuery({
    queryKey: ['accountType', accountTypeId],
    queryFn: async () => await AccountTypeApiService.getUserAccountType(accountTypeId || 0),
    enabled: !!accountTypeId,
  })

  if (!accountTypeId) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>No Account Selected</CardTitle>
            <CardDescription>Please select an account type from the sidebar to view details</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-[90vh] p-6 space-y-6">
      <CurrentAccount />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TransferBalance />

        <AccountDetails />
      </div>
      <EditAccountDetails />
    </div>
  )
}

export default AccountsPage
