'use client'

import { useAuth } from '@/app/hooks/use-auth'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const recentTransactions = [
  { id: 1, description: 'Grocery Store', amount: -85.5, category: 'Food', date: '2024-01-15' },
  { id: 2, description: 'Gas Station', amount: -45.2, category: 'Transport', date: '2024-01-14' },
  { id: 3, description: 'Netflix', amount: -15.99, category: 'Entertainment', date: '2024-01-13' },
  { id: 4, description: 'Salary', amount: 3200.0, category: 'Income', date: '2024-01-12' },
  { id: 5, description: 'Coffee Shop', amount: -12.75, category: 'Food', date: '2024-01-12' },
]

const RecentTransactions = () => {
  const { user, isAuthInitialized } = useAuth()

  if (!isAuthInitialized) {
    return <Skeleton className="max-w-7xl min-h-[757px] bg-white/80" />
  }

  return (
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
  )
}
export default RecentTransactions
