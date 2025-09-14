'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { activeViewAtom } from '@/components/shared/LeftSidebar'
import RechartsDonutChart from '@/components/shared/RechartsDonutChart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAtom, useAtomValue } from 'jotai'

const expenseData = [
  { category: 'Food', amount: 850, color: '#059669' },
  { category: 'Transport', amount: 320, color: '#0d9488' },
  { category: 'Entertainment', amount: 240, color: '#10b981' },
  { category: 'Shopping', amount: 450, color: '#34d399' },
  { category: 'Bills', amount: 680, color: '#6ee7b7' },
  { category: 'Healthcare', amount: 180, color: '#a7f3d0' },
]

const recentTransactions = [
  { id: 1, description: 'Grocery Store', amount: -85.5, category: 'Food', date: '2024-01-15' },
  { id: 2, description: 'Gas Station', amount: -45.2, category: 'Transport', date: '2024-01-14' },
  { id: 3, description: 'Netflix', amount: -15.99, category: 'Entertainment', date: '2024-01-13' },
  { id: 4, description: 'Salary', amount: 3200.0, category: 'Income', date: '2024-01-12' },
  { id: 5, description: 'Coffee Shop', amount: -12.75, category: 'Food', date: '2024-01-12' },
]

export default function HomePage() {
  const { user, logout } = useAuth()

  const activeView = useAtomValue(activeViewAtom)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mb-8">
        <Card className="bg-white/80 backdrop-blur-sm shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <span className="text-md font-bold text-white">{user?.currency}</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">MoneyMate</h1>
                  <p className="text-muted-foreground mt-1">
                    Welcome back, <span className="font-bold">{user?.name}</span>
                  </p>
                </div>
              </div>
              <Button variant="ghost" onClick={logout} className="text-destructive hover:bg-destructive/10">
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-7xl grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Expense Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-0">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                <RechartsDonutChart data={expenseData} />
              </div>
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

      {/* Recent Transactions */}
      <div className="max-w-7xl mt-8">
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors border border-border">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{transaction.description.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-lg">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={transaction.category === 'Income' ? 'default' : 'secondary'} className="font-semibold">
                      {transaction.category}
                    </Badge>
                    <span className={`font-bold text-lg ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : '-'}
                      {user?.currency} {Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
