import TransactionApiService from '@/app/ApiService/TransactionApiService'
import { useAuth } from '@/app/contexts/AuthContext'
import { accountTypeAtom, activeViewAtom } from '@/components/shared/LeftSidebar'
import RechartsDonutChart from '@/components/shared/RechartsDonutChart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ActiveViewModes } from '@/types/activeViewMode'
import { useQuery } from '@tanstack/react-query'
import { addDays, subDays } from 'date-fns'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

const getDateIntervalBasedOnActiveViewMode = (activeView: ActiveViewModes): { from: string; to: string } => {
  switch (activeView) {
    case 'day':
      return {
        from: subDays(new Date(), 2).toISOString(), // 2 days ago
        to: new Date().toISOString(), // today
      }
    case 'week':
      return {
        from: subDays(new Date(), 8).toISOString(),
        to: addDays(new Date(), 5).toISOString(),
      }
    default:
      return {
        from: new Date().toISOString(),
        to: new Date().toISOString(),
      }
  }
}

const ExpenseOverview = () => {
  const { user } = useAuth()
  const accountTypeId = useAtomValue(accountTypeAtom)
  const activeView = useAtomValue(activeViewAtom)

  const { from, to } = useMemo(() => getDateIntervalBasedOnActiveViewMode(activeView), [activeView])

  const { data: transactionInfo } = useQuery({
    queryKey: ['userTransactionsInfo', accountTypeId, from, to],
    queryFn: () => TransactionApiService.getUserTransactionsInfo(Number(accountTypeId), from, to),
    enabled: !!accountTypeId && !!from && !!to,
  })

  console.log(transactionInfo)

  return (
    <div className="max-w-7xl grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Chart Section */}
      <div className="lg:col-span-2">
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Expense Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-0">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">{transactionInfo && <RechartsDonutChart data={transactionInfo?.transactions} />}</div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="space-y-6">
        {/* Balance Card */}
        <Card className="shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="text-center p-8">
            <h3 className="text-lg font-semibold mb-3">Current Balance</h3>
            <p className="text-4xl font-bold mb-2">4,280.45 {user?.currency}</p>
            <p className="text-green-100 text-sm">+2.5% from last month</p>
          </CardContent>
        </Card>

        {/* Monthly Spending */}
        <Card className="shadow-lg">
          <CardContent className="text-center p-8">
            <h3 className="text-lg font-semibold text-foreground mb-3">This Month Spending</h3>
            <p className="text-4xl font-bold text-destructive mb-2">2,720 {user?.currency}</p>
            <p className="text-muted-foreground text-sm">Total expenses</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <Button size="lg">Add Income</Button>
            <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white" size="lg">
              Add Expense
            </Button>
            <Button className="w-full" variant="outline" size="lg">
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export default ExpenseOverview
