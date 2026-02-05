import { getDateIntervalBasedOnActiveViewMode, transactionInfoIntervalAtom } from '@/app/(main)/components/ExpenseOverview'
import { transactionModalStateAtom } from '@/app/(main)/components/store'
import TransactionApiService from '@/app/ApiService/TransactionApiService'
import { useAuth } from '@/app/hooks/use-auth'
import { accountTypeAtom } from '@/app/stores/accountType'
import { TransactionSchema } from '@/app/zod/transaction.schema'
import { addTransactionCategoryAtom } from '@/components/shared/RechartsDonutChart'
import { activeViewAtom } from '@/components/shared/store'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useAtom, useAtomValue } from 'jotai'
import { Calendar as CalendarIcon, Plus } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const ExpenseCategory = {
  FOOD_DRINKS: 'food_drinks',
  SHOPPING: 'shopping',
  HOUSING: 'housing',
  TRANSPORTATION: 'transportation',
  VEHICLE: 'vehicle',
  LIFE_ENTERTAINMENT: 'life_entertainment',
  COMMUNICATION_PC: 'communication_pc',
  FINANCIAL_EXPENSES: 'financial_expenses',
  INVESTMENTS: 'investments',
  OTHERS_EXPENSE: 'others_expense',
  TRANSFER: 'transfer_income',
} as const

const IncomeCategory = {
  SALARY: 'salary',
  AWARDS: 'awards',
  GRANTS: 'grants',
  SALE: 'sale',
  RENTAL: 'rental',
  REFUNDS: 'refunds',
  COUPON: 'coupon',
  LOTTERY: 'lottery',
  GIFTS: 'gifts',
  INTERESTS: 'interests',
  OTHERS_INCOME: 'others_income',
  TRANSFER: 'transfer',
} as const

export { ExpenseCategory, IncomeCategory }

type FormData = z.infer<typeof TransactionSchema>

const TransactionModal = () => {
  const [addTransactionCategory, setAddTransactionCategory] = useAtom(addTransactionCategoryAtom)
  const { user } = useAuth()
  const [transactionModalState, setTransactionModalState] = useAtom(transactionModalStateAtom)

  const queryClient = useQueryClient()
  const activeView = useAtomValue(activeViewAtom)
  const [transactionInfoInterval] = useAtom(transactionInfoIntervalAtom)
  const transactionInfoIntervalDate = useMemo(() => new Date(transactionInfoInterval), [transactionInfoInterval])
  const accountTypeId = useAtomValue(accountTypeAtom)

  const { from, to } = useMemo(() => getDateIntervalBasedOnActiveViewMode(activeView, transactionInfoIntervalDate), [activeView, transactionInfoIntervalDate])

  const form = useForm<FormData>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      money: undefined,
      type: undefined,
      category: '',
      createdAt: new Date(),
    },
  })

  const editingTransaction = transactionModalState.data.id

  useEffect(() => {
    if (!transactionModalState.data.id) return
    form.reset({
      category: transactionModalState.data?.category || '',
      createdAt: new Date(transactionModalState.data?.createdAt || '') || new Date(),
      money: Number(transactionModalState.data?.money) || 0,
      type: transactionModalState.data?.type || 'expense',
    })
  }, [form, transactionModalState])

  useEffect(() => {
    if (!addTransactionCategory) return
    form.setValue('type', 'expense')
    form.setValue('category', addTransactionCategory)
    setTransactionModalState({
      open: true,
      data: {},
    })
  }, [addTransactionCategory, form])

  const watchedType = form.watch('type')

  const addTransactionMutation = useMutation({
    mutationFn: (data: Parameters<typeof TransactionApiService.addTransaction>[0]) => TransactionApiService.addTransaction(data),
    onSuccess: () => {
      setTransactionModalState({
        open: false,
        data: {},
      })
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['userTransactionsInfo'] })
      queryClient.invalidateQueries({ queryKey: ['accountTypes'] })
      queryClient.invalidateQueries({ queryKey: ['userTransactionsPaginated', accountTypeId] })
    },
  })

  const editTransactionMutation = useMutation({
    mutationFn: (data: Parameters<typeof TransactionApiService.addTransaction>[0]) => TransactionApiService.editTransaction(transactionModalState.data.id || 0, data),
    onSuccess: () => {
      setTransactionModalState({
        open: false,
        data: {},
      })
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['userTransactionsInfo'] })
      queryClient.invalidateQueries({ queryKey: ['accountTypes'] })
      queryClient.invalidateQueries({ queryKey: ['userTransactionsPaginated', accountTypeId] })
    },
  })

  const onSubmit = (data: FormData) => {
    if (!user?.id || !user?.activeAccountTypeId) return

    const transactionData = {
      ...(editingTransaction ? { user } : { userId: user.id, accountTypeId: user.activeAccountTypeId }),
      money: data.money,
      type: data.type,
      category: data.category,
      createdAt: format(data.createdAt, 'yyyy-MM-dd'),
    }

    if (editingTransaction) {
      editTransactionMutation.mutate(transactionData)
    } else {
      addTransactionMutation.mutate(transactionData)
    }
  }

  const getCategoryOptions = () => {
    if (watchedType === 'income') {
      return Object.entries(IncomeCategory).map(([key, value]) => ({
        label: key
          .replace(/_/g, ' ')
          .toLowerCase()
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        value,
      }))
    } else if (watchedType === 'expense') {
      return Object.entries(ExpenseCategory).map(([key, value]) => ({
        label: key
          .replace(/_/g, ' ')
          .toLowerCase()
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        value,
      }))
    }
    return []
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.handleSubmit(onSubmit)(e)
  }

  const getSubmitButtonText = () => {
    if (editingTransaction) {
      return editTransactionMutation.isPending ? 'Editing' : 'Edit Transaction'
    } else {
      return addTransactionMutation.isPending ? 'Adding...' : 'Add Transaction'
    }
  }

  return (
    <Dialog
      open={transactionModalState.open}
      onOpenChange={(open) => {
        setTransactionModalState({
          open,
          data: {},
        })
        if (!open) setAddTransactionCategory(null)
      }}
    >
      <DialogTrigger asChild>
        <Button size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white">
          <Plus className="w-5 h-5 mr-2" />
          {editingTransaction ? 'Edit' : 'Add'} Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {editingTransaction ? (
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>Edit existing transaction</DialogDescription>
          </DialogHeader>
        ) : (
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>Add a new income or expense transaction to your account.</DialogDescription>
          </DialogHeader>
        )}

        <Form {...form}>
          <div onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <FormField
              control={form.control}
              name="money"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input defaultValue={Number(field.value)} type="number" step="0.01" min="0" placeholder="Enter amount" onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transaction Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.setValue('category', '') // Reset category when type changes
                      }}
                      value={field.value}
                      className="flex flex-row space-x-4"
                      defaultValue={addTransactionCategory ? 'expense' : ''}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem className="peer" value="income" id="income" />
                        <Label htmlFor="income">Income</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expense" id="expense" />
                        <Label htmlFor="expense">Expense</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!watchedType}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={watchedType ? `Select ${watchedType} category` : 'Select transaction type first'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getCategoryOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="createdAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setTransactionModalState({
                    open: false,
                    data: {},
                  })
                }
              >
                Cancel
              </Button>
              <Button type="submit" onClick={handleSubmit} disabled={addTransactionMutation.isPending} className="bg-green-500 hover:bg-green-600">
                {getSubmitButtonText()}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default TransactionModal
