import AddTransactionModal from '@/app/(main)/components/AddTransaction'
import DateController from '@/app/(main)/components/DateController'
import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import TransactionApiService from '@/app/ApiService/TransactionApiService'
import { useAuth } from '@/app/contexts/AuthContext'
import { accountTypeAtom, activeViewAtom } from '@/components/shared/LeftSidebar'
import RechartsDonutChart from '@/components/shared/RechartsDonutChart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ActiveViewModes } from '@/types/activeViewMode'
import { useQuery } from '@tanstack/react-query'
import { addDays, subDays } from 'date-fns'
import { atom, useAtom, useAtomValue } from 'jotai'
import { Loader } from 'lucide-react'
import { useMemo } from 'react'

export const getDateIntervalBasedOnActiveViewMode = (activeView: ActiveViewModes, intervalDate: Date): { from: string; to: string } => {
  switch (activeView) {
    case 'day':
      return {
        from: subDays(intervalDate, 1).toISOString(), // 2 days ago
        to: intervalDate.toISOString(), // today
      }
    case 'week':
      return {
        from: subDays(intervalDate, 7).toISOString(),
        to: intervalDate.toISOString(),
      }
    default:
      return {
        from: new Date().toISOString(),
        to: addDays(new Date(), 1).toISOString(),
      }
  }
}

export const transactionInfoIntervalAtom = atom(new Date().toISOString())
const ExpenseOverview = () => {
  const { user } = useAuth()
  const accountTypeId = useAtomValue(accountTypeAtom)
  console.log('🚀 ~ ExpenseOverview ~ accountTypeId:', accountTypeId)
  const activeView = useAtomValue(activeViewAtom)
  const [transactionInfoInterval, setTransactionInfoInterval] = useAtom(transactionInfoIntervalAtom)

  const transactionInfoIntervalDate = useMemo(() => new Date(transactionInfoInterval), [transactionInfoInterval])

  const { from, to } = useMemo(() => getDateIntervalBasedOnActiveViewMode(activeView, transactionInfoIntervalDate), [activeView, transactionInfoIntervalDate])

  const { data: transactionInfo, isLoading: transactionInfoLoading } = useQuery({
    queryKey: ['userTransactionsInfo', accountTypeId, from, to, user?.email],
    queryFn: () => TransactionApiService.getUserTransactionsInfo(Number(accountTypeId), from, to),
    enabled: !!accountTypeId && accountTypeId > 0 && !!from && !!to && !!user?.email,
  })
  const { data: accountType, isLoading: accountTypeLoading } = useQuery({
    queryKey: ['userAccountType', accountTypeId],
    queryFn: () => AccountTypeApiService.getUserAccountType(Number(accountTypeId)),
    enabled: !!accountTypeId && accountTypeId > 0,
  })
  console.log('🚀 ~ ExpenseOverview ~ accountType:', accountType)

  return (
    <div className="max-w-7xl grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Chart Section */}
      <div className="lg:col-span-2">
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Expense Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-0">
            <DateController />
            <div className="flex flex-col lg:flex-row min-h-[70vh] justify-center items-center gap-8">
              {transactionInfoLoading ? <Loader className="text-green-500 animate-spin" /> : transactionInfo && <RechartsDonutChart data={transactionInfo?.transactions} />}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="space-y-6">
        {/* Balance Card */}
        <Card className="shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="text-center p-8">
            {!accountType ? (
              <p className="text-white">No Details to Show</p>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-3">Current Balance</h3>
                <p className="text-4xl font-bold mb-2">
                  {accountType?.balance} {user?.currency}
                </p>
                <p className="text-green-100 text-sm">+2.5% from last month</p>
              </div>
            )}
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
            <AddTransactionModal />
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
