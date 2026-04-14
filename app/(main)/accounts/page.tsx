import AccountContentContainer from '@/app/(main)/accounts/components/AccountContentContainer'
import AccountDetails from '@/app/(main)/accounts/components/AccountDetails'
import AccountTypes from '@/app/(main)/accounts/components/AccountTypes'
import EditAccountDetails from '@/app/(main)/accounts/components/EditAccountDetails'
import MarkedAccounts from '@/app/(main)/accounts/components/MarkedAccounts'
import TransferBalance from '@/app/(main)/accounts/components/TransferBalance'

export default function AccountsPage() {
  return (
    <div className="min-h-[90vh] p-6 space-y-6 max-w-7xl mx-auto">
      <AccountContentContainer>
        <MarkedAccounts />
      </AccountContentContainer>
      <AccountTypes />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TransferBalance />
        <AccountDetails />
      </div>
      <EditAccountDetails />
    </div>
  )
}
