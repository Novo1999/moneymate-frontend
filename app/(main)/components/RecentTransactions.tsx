import { transactionFiltersAtom, transactionModalStateAtom } from '@/app/(main)/components/store'
import TransactionApiService from '@/app/ApiService/TransactionApiService'
import { useAuth } from '@/app/hooks/use-auth'
import useInfiniteScroll from '@/app/hooks/useInfiniteScroll'
import { accountTypeAtom } from '@/app/stores/accountType'
import { TRANSACTION_CATEGORY_LABEL } from '@/app/utils/constants'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TransactionType } from '@/types/transaction'
import { useInfiniteQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useAtomValue, useSetAtom } from 'jotai'
import { Loader, Pen } from 'lucide-react'

const RecentTransactions = () => {
  const { user, isAuthInitialized } = useAuth()
  const accountTypeId = useAtomValue(accountTypeAtom)
  const transactionFilters = useAtomValue(transactionFiltersAtom)
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['userTransactionsPaginated', accountTypeId, transactionFilters],
    queryFn: async ({ pageParam }) => await TransactionApiService.getUserTransactionsPaginated(accountTypeId, pageParam, 10, transactionFilters.category, transactionFilters?.type),
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

  return isLoading ? (
    <div className="min-h-96 flex justify-center items-center">
      <Loader className="animate-spin text-green-500" />
    </div>
  ) : (
    <div id="transactions" className="space-y-3 max-h-96 overflow-auto">
      {paginatedTransactions.map((transaction) => (
        <div
          key={transaction?.id}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between
               p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors
               border border-border"
        >
          {/* Left section */}
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm capitalize">{transaction?.category.charAt(0)}</span>
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-foreground text-base sm:text-lg capitalize truncate">{transaction?.category}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{format(new Date(transaction?.createdAt || ''), 'yyyy-MM-dd HH:mm:ss')}</p>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Button onClick={() => transaction && handleEdit(transaction)} size="sm">
                <Pen className="w-4 h-4" />
              </Button>

              <Button size="sm" variant={transaction?.type === 'income' ? 'default' : 'destructive'} className="font-semibold capitalize text-xs sm:text-sm">
                {TRANSACTION_CATEGORY_LABEL?.[transaction?.category || ''] ?? transaction?.category}
              </Button>
            </div>

            <p className={`font-bold text-base sm:text-lg whitespace-nowrap ${transaction?.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
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
