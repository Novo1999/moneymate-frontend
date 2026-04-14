import ExpenseOverview from '@/app/(main)/components/ExpenseOverview'
import RecentTransactionContainer from '@/app/(main)/components/RecentTransactionContainer'
import UserBlock from '@/app/(main)/components/UserBlock'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 lg:p-8 2xl:py-12">
      <div className="w-full max-w-7xl flex flex-col gap-8">
        <UserBlock />
        <ExpenseOverview />
        <RecentTransactionContainer />
      </div>
    </div>
  )
}
