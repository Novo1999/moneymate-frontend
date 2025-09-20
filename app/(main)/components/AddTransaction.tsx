import { getDateIntervalBasedOnActiveViewMode, transactionInfoIntervalAtom } from '@/app/(main)/components/ExpenseOverview'
import TransactionApiService from '@/app/ApiService/TransactionApiService'
import { useAuth } from '@/app/contexts/AuthContext'
import { accountTypeAtom, activeViewAtom } from '@/components/shared/LeftSidebar'
import { addTransactionCategoryAtom } from '@/components/shared/RechartsDonutChart'
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
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const TransactionType = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const

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

export { ExpenseCategory, IncomeCategory, TransactionType }

// Form schema
const formSchema = z.object({
  money: z
    .number()
    .min(1, 'Amount is required')
    .refine((val) => val > 0, 'Amount must be greater than 0'),

  type: z.enum(TransactionType),

  category: z.string().min(1, 'Category is required'),

  createdAt: z.date(),
})

type FormData = z.infer<typeof formSchema>

const AddTransactionModal = () => {
  const [addTransactionCategory, setAddTransactionCategory] = useAtom(addTransactionCategoryAtom)
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const activeView = useAtomValue(activeViewAtom)
  const [transactionInfoInterval] = useAtom(transactionInfoIntervalAtom)
  const transactionInfoIntervalDate = useMemo(() => new Date(transactionInfoInterval), [transactionInfoInterval])
  const accountTypeId = useAtomValue(accountTypeAtom)

  const { from, to } = useMemo(() => getDateIntervalBasedOnActiveViewMode(activeView, transactionInfoIntervalDate), [activeView, transactionInfoIntervalDate])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      money: undefined,
      type: undefined,
      category: '',
      createdAt: new Date(),
    },
  })

  useEffect(() => {
    if (!addTransactionCategory) return
    form.setValue('type', 'expense')
    form.setValue('category', addTransactionCategory)
    setOpen(true)
  }, [addTransactionCategory, form])

  const watchedType = form.watch('type')

  const addTransactionMutation = useMutation({
    mutationFn: (data: Parameters<typeof TransactionApiService.addTransaction>[0]) => TransactionApiService.addTransaction(data),
    onSuccess: () => {
      setOpen(false)
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['userTransactionsInfo', accountTypeId, from, to] })
      queryClient.invalidateQueries({ queryKey: ['accountTypes'] })
    },
  })

  const onSubmit = (data: FormData) => {
    if (!user?.id || !user?.activeAccountTypeId) return

    const transactionData = {
      userId: user.id,
      money: data.money,
      type: data.type,
      category: data.category,
      accountTypeId: user.activeAccountTypeId,
      createdAt: format(data.createdAt, 'yyyy-MM-dd'),
    }

    addTransactionMutation.mutate(transactionData)
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

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        if (!open) setAddTransactionCategory(null)
      }}
    >
      <DialogTrigger asChild>
        <Button size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white">
          <Plus className="w-5 h-5 mr-2" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>Add a new income or expense transaction to your account.</DialogDescription>
        </DialogHeader>

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
                    <Input type="number" step="0.01" min="0" placeholder="Enter amount" onChange={(e) => field.onChange(Number(e.target.value))} />
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
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleSubmit} disabled={addTransactionMutation.isPending} className="bg-green-500 hover:bg-green-600">
                {addTransactionMutation.isPending ? 'Adding...' : 'Add Transaction'}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddTransactionModal
