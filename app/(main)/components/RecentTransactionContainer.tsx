'use client'
import RecentTransactions from '@/app/(main)/components/RecentTransactions'
import { transactionFiltersAtom } from '@/app/(main)/components/store'
import TransactionApiService from '@/app/ApiService/TransactionApiService'
import { accountTypeAtom } from '@/app/stores/accountType'
import { TRANSACTION_CATEGORY_LABEL } from '@/app/utils/constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from '@/components/ui/menubar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExpenseCategory, IncomeCategory } from '@/types/categories'
import { TransactionType } from '@/types/transaction'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'
import { Check, X } from 'lucide-react'

const formatCategoryLabel = (category: string) => {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const RecentTransactionContainer = () => {
  const accountTypeId = useAtomValue(accountTypeAtom)
  const { data } = useInfiniteQuery({
    queryKey: ['userTransactionsPaginated', accountTypeId],
    queryFn: async ({ pageParam }) => await TransactionApiService.getUserTransactionsPaginated(accountTypeId, pageParam, 10),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    enabled: !!accountTypeId,
  })

  const [transactionFilters, setTransactionFilters] = useAtom(transactionFiltersAtom)

  const handleCategorySelect = (category: IncomeCategory | ExpenseCategory) => {
    setTransactionFilters({
      category,
    })
  }

  const handleClearCategory = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setTransactionFilters({ category: '' })
  }

  const handleTypeChange = (value: string) => {
    if (value === '' || value === 'income' || value === 'expense') {
      setTransactionFilters({
        ...transactionFilters,
        type: value as TransactionType['type'] | '',
      })
    }
  }

  return (
    <Card className="shadow-lg max-w-7xl mt-8">
      <div className="flex justify-between items-center">
        <CardHeader className="pb-4 w-full">
          <CardTitle className="text-lg sm:text-2xl text-primary">Recent Transactions ({data?.pages?.[0]?.count})</CardTitle>
        </CardHeader>
        <div className="pr-6 flex items-center gap-3">
          <Tabs defaultValue="" value={transactionFilters.type || ''} onValueChange={handleTypeChange}>
            <TabsList>
              <TabsTrigger value="">All</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expense">Expense</TabsTrigger>
            </TabsList>
          </Tabs>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="capitalize truncate">
                {transactionFilters.category && <span>Category : </span>} {TRANSACTION_CATEGORY_LABEL?.[transactionFilters?.category || ''] || 'Category'}
              </MenubarTrigger>
              <MenubarContent>
                <MenubarSub>
                  <MenubarSubTrigger>Income</MenubarSubTrigger>
                  <MenubarSubContent>
                    {Object.values(IncomeCategory).map((category) => (
                      <MenubarItem key={category} onClick={() => handleCategorySelect(category)} className="flex items-center justify-between">
                        {formatCategoryLabel(category)}
                        {transactionFilters.category === category && <Check className="h-4 w-4 ml-2" />}
                      </MenubarItem>
                    ))}
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>Expense</MenubarSubTrigger>
                  <MenubarSubContent>
                    {Object.values(ExpenseCategory).map((category) => (
                      <MenubarItem key={category} onClick={() => handleCategorySelect(category)} className="flex items-center justify-between">
                        {formatCategoryLabel(category)}
                        {transactionFilters.category === category && <Check className="h-4 w-4 ml-2" />}
                      </MenubarItem>
                    ))}
                  </MenubarSubContent>
                </MenubarSub>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          {transactionFilters.category && (
            <button onClick={handleClearCategory} className="hover:bg-primary hover:text-white rounded-full p-1 transition-colors" aria-label="Clear category filter">
              <X size={20} />
            </button>
          )}
        </div>
      </div>
      <CardContent className="pt-0">
        <RecentTransactions />
      </CardContent>
    </Card>
  )
}
export default RecentTransactionContainer
