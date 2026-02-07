import ExpenseOverview from '@/app/(main)/components/ExpenseOverview'
import RecentTransactionContainer from '@/app/(main)/components/RecentTransactionContainer'
import UserBlock from '@/app/(main)/components/UserBlock'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-emerald-50 p-6">
      <UserBlock />

      <ExpenseOverview />

      <RecentTransactionContainer />
    </div>
  )
}
