'use client'

import CategoryFilter from '@/app/(main)/components/filter/CategoryFilter'
import RangeFilter from '@/app/(main)/components/filter/RangeFilter'
import TypeTabs from '@/app/(main)/components/filter/TypeTabs'
import RecentTransactions from '@/app/(main)/components/RecentTransactions'
import { transactionFiltersAtom } from '@/app/(main)/components/store'
import TransactionApiService from '@/app/ApiService/TransactionApiService'
import { useDebounce } from '@/app/hooks/use-debounce'
import { accountTypeAtom } from '@/app/stores/accountType'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useMemo, useState } from 'react'

const RecentTransactionContainer = () => {
  const accountTypeId = useAtomValue(accountTypeAtom)
  const [transactionFilters, setTransactionFilters] = useAtom(transactionFiltersAtom)
  const [rangeValue, setRangeValue] = useState<[number, number]>([0, 0])

  const debouncedRangeValue = useDebounce(rangeValue, 500)

  const { data } = useInfiniteQuery({
    queryKey: ['userTransactionsPaginated', accountTypeId],
    queryFn: ({ pageParam }) => TransactionApiService.getUserTransactionsPaginated(accountTypeId, pageParam, 10),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    enabled: !!accountTypeId,
  })

  const { data: maxRangeData, isLoading: isLoadingMax } = useQuery({
    queryKey: ['transactions', 'max-amount', accountTypeId],
    queryFn: () => TransactionApiService.getUserMaxMoneyAmount(accountTypeId),
    enabled: !!accountTypeId,
  })

  const maxValue = useMemo(() => maxRangeData?.maxAmount || 10000, [maxRangeData])

  useEffect(() => {
    setRangeValue([0, maxValue])
  }, [maxValue])

  useEffect(() => {
    setTransactionFilters({
      ...transactionFilters,
      money: {
        min: debouncedRangeValue[0],
        max: debouncedRangeValue[1],
      },
    })
  }, [debouncedRangeValue])

  return (
    <Card id="transactions" className="shadow-lg max-w-7xl mt-8">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-2xl text-primary">Recent Transactions ({data?.pages?.[0]?.count})</CardTitle>
      </CardHeader>

      <div className="px-6 flex items-center gap-3 w-full max-w-2xl flex-wrap sm:flex-nowrap">
        <RangeFilter value={rangeValue} max={maxValue} isLoading={isLoadingMax} onChange={setRangeValue} />

        <TypeTabs
          value={transactionFilters.type || ''}
          onChange={(type) =>
            setTransactionFilters({
              ...transactionFilters,
              type,
            })
          }
        />

        <CategoryFilter
          value={transactionFilters.category || ''}
          onChange={(category) =>
            setTransactionFilters({
              ...transactionFilters,
              category,
            })
          }
          onClear={() => setTransactionFilters({ category: '' })}
        />
      </div>

      <CardContent className="pt-0">
        <RecentTransactions />
      </CardContent>
    </Card>
  )
}

export default RecentTransactionContainer
