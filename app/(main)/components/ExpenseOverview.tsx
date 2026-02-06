'use client'
import DateController from '@/app/(main)/components/DateController'
import { transactionInfoIntervalAtom } from '@/app/(main)/components/store'
import TransactionModal from '@/app/(main)/components/TransactionModal'
import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import TransactionApiService from '@/app/ApiService/TransactionApiService'
import { useAuth } from '@/app/hooks/use-auth'
import { accountTypeAtom } from '@/app/stores/accountType'
import { getCurrentMonthFirstAndLastDate } from '@/app/utils/date'
import { activeViewAtom, dateRangeAtom } from '@/components/shared/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getDateIntervalBasedOnActiveViewMode } from '@/lib/interval'
import { useQuery } from '@tanstack/react-query'
import { isSameDay } from 'date-fns'
import { useAtomValue } from 'jotai'
import { Loader } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const DynamicChart = dynamic(() => import('@/components/shared/RechartsDonutChart'), {
  ssr: false,
  loading({ isLoading, error }) {
    if (isLoading) return <Loader className="animate-spin" />
    if (error) return <p className="text-red-500">Failed to load chart</p>
  },
})

const ExpenseOverview = () => {
  const { user, isAuthInitialized } = useAuth()
  const accountTypeId = useAtomValue(accountTypeAtom)
  const activeView = useAtomValue(activeViewAtom)
  const transactionInfoInterval = useAtomValue(transactionInfoIntervalAtom)

  const transactionInfoIntervalDate = useMemo(() => new Date(transactionInfoInterval), [transactionInfoInterval])
  const dateRange = useAtomValue(dateRangeAtom)
  const { from, to } = useMemo(
    () => getDateIntervalBasedOnActiveViewMode(activeView === 'today' ? 'day' : activeView, transactionInfoIntervalDate, dateRange),
    [activeView, transactionInfoIntervalDate, dateRange],
  )

  const { data: transactionInfo, isLoading: transactionInfoLoading } = useQuery({
    queryKey: ['userTransactionsInfo', accountTypeId, from, to, user?.email],
    queryFn: () => TransactionApiService.getUserTransactionsInfo(accountTypeId, from, to),
    enabled: () => {
      if (!accountTypeId || accountTypeId <= 0) return false
      if (!from || !to) return false
      if (!user?.email || !user?.activeAccountTypeId) return false

      if (activeView === 'custom') {
        if (!dateRange?.from || !dateRange?.to) return false
        if (isSameDay(dateRange.from, dateRange.to)) return false
      }

      return true
    },
  })

  const { data: accountType } = useQuery({
    queryKey: ['userAccountType', accountTypeId],
    queryFn: () => AccountTypeApiService.getUserAccountType(accountTypeId),
    enabled: !!accountTypeId && accountTypeId > 0,
  })
  const { fromDate, toDate } = useMemo(() => getCurrentMonthFirstAndLastDate(), [])

  const { data: monthlySpending, isLoading: monthlySpendingLoading } = useQuery({
    queryKey: ['monthlySpending', accountTypeId, fromDate, toDate],
    queryFn: async () => {
      const data = await TransactionApiService.getUserTransactionsInfo(accountTypeId, fromDate, toDate)

      return data?.transactions.reduce((total, t) => total + Number(t.money), 0)
    },
    enabled: !!accountTypeId && !!user?.activeAccountTypeId,
  })

  if (!isAuthInitialized) {
    return <Skeleton className="max-w-7xl min-h-[757px] bg-white/80" />
  }

  return (
    <div className="max-w-7xl grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Chart Section */}
      <div className="lg:col-span-2">
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-primary">Expense Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-0">
            <DateController />
            <div className="flex flex-col lg:flex-row min-h-[70vh] justify-center items-center gap-8">
              {transactionInfoLoading ? <Loader className="text-green-500 animate-spin" /> : transactionInfo && <DynamicChart data={transactionInfo?.transactions} />}
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
            <p className="text-4xl font-bold text-destructive mb-2">{monthlySpendingLoading ? <Loader className="animate-spin mx-auto" /> : monthlySpending}</p>
            <p className="text-muted-foreground text-sm">Total expenses</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <TransactionModal />
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
