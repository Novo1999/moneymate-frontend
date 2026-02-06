import { transactionModalStateAtom } from '@/app/(main)/components/store'
import TransactionApiService from '@/app/ApiService/TransactionApiService'
import { useAuth } from '@/app/hooks/use-auth'
import useInfiniteScroll from '@/app/hooks/useInfiniteScroll'
import { accountTypeAtom } from '@/app/stores/accountType'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TransactionType } from '@/types/transaction'
import { useInfiniteQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useAtomValue, useSetAtom } from 'jotai'
import { Pen } from 'lucide-react'

const RecentTransactions = () => {
  const { user, isAuthInitialized } = useAuth()
  const accountTypeId = useAtomValue(accountTypeAtom)
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['userTransactionsPaginated', accountTypeId],
    queryFn: async ({ pageParam }) => await TransactionApiService.getUserTransactionsPaginated(accountTypeId, pageParam, 10),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    enabled: !!accountTypeId,
  })
  const { loadMoreRef } = useInfiniteScroll({ hasNextPage, fetch: fetchNextPage })
  const setTransactionModalState = useSetAtom(transactionModalStateAtom)

  const paginatedTransactions = data?.pages?.flatMap((page) => page?.transactions) || []

  if (!isAuthInitialized) {
    return <Skeleton className="max-w-7xl min-h-[757px] bg-white/80" />
  }

  const handleEdit = (transaction: TransactionType) => {
    setTransactionModalState({
      open: true,
      data: transaction,
    })
  }

  return (
    <div id='transactions' className="space-y-3 max-h-96 overflow-auto">
      {paginatedTransactions.map((transaction) => (
        <div key={transaction?.id} className="flex items-center justify-between p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors border border-border">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm capitalize">{transaction?.category.charAt(0)}</span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg capitalize">{transaction?.category}</p>
                <p className="text-sm text-muted-foreground">{format(new Date(transaction?.createdAt || ''), 'yyyy-MM-dd HH:mm:ss')}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* edit */}
            <Button onClick={() => transaction && handleEdit(transaction)} size="sm">
              <Pen />
            </Button>
            <Button size="sm" variant={transaction?.type === 'income' ? 'default' : 'destructive'} className="font-semibold capitalize">
              {transaction?.category}
            </Button>
            <p className={`font-bold text-lg ${transaction?.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction?.type === 'income' ? '+' : '-'}
              {user?.currency} {Math.abs(Number(transaction?.money)).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
      <div ref={loadMoreRef} className="min-h-6"></div>
    </div>
  )
}
export default RecentTransactions
