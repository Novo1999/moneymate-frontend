import ExpenseOverview from '@/app/(main)/components/ExpenseOverview'
import RecentTransactions from '@/app/(main)/components/RecentTransactions'
import UserBlock from '@/app/(main)/components/UserBlock'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <UserBlock />

      <ExpenseOverview />

      <Card className="shadow-lg max-w-7xl mt-8">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <RecentTransactions />
        </CardContent>
      </Card>
    </div>
  )
}
