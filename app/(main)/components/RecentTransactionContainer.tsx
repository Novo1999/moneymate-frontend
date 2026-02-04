'use client'
import RecentTransactions from '@/app/(main)/components/RecentTransactions'
import TransactionApiService from '@/app/ApiService/TransactionApiService'
import { accountTypeAtom } from '@/app/stores/accountType'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

const RecentTransactionContainer = () => {
  const accountTypeId = useAtomValue(accountTypeAtom)
  const { data } = useInfiniteQuery({
    queryKey: ['userTransactionsPaginated', accountTypeId],
    queryFn: async ({ pageParam }) => await TransactionApiService.getUserTransactionsPaginated(accountTypeId, pageParam, 10),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    enabled: !!accountTypeId,
  })
  return (
    <Card className="shadow-lg max-w-7xl mt-8">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">Recent Transactions ({data?.pages?.[0]?.count})</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <RecentTransactions />
      </CardContent>
    </Card>
  )
}
export default RecentTransactionContainer
