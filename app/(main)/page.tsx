import ExpenseOverview from '@/app/(main)/components/ExpenseOverview'
import RecentTransactionContainer from '@/app/(main)/components/RecentTransactionContainer'
import UserBlock from '@/app/(main)/components/UserBlock'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-emerald-50 rounded-xl p-1 flex flex-col items-center 2xl:py-12">
      <UserBlock />

      <ExpenseOverview />

      <RecentTransactionContainer />
    </div>
  )
}
