'use client'

import ExpenseOverview from '@/app/(main)/components/ExpenseOverview'
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

      <ExpenseOverview />

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
