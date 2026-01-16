'use client'
import CategoryItem from '@/app/(main)/categories/components/CategoryItem'
import CategoryApiService from '@/app/ApiService/CategoryApiService'
import { CategoryDto } from '@/app/dto/CategoryDto'
import { useAuth } from '@/app/hooks/use-auth'
import { iconOptions } from '@/app/utils/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { ExpenseCategory, IncomeCategory } from '@/types/categories'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DollarSign, Loader, LucideArrowDownNarrowWide, Plus } from 'lucide-react'

import { useRef, useState } from 'react'
import { toast } from 'sonner'

const formatCategoryName = (category: string) => {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const CategoryPage = () => {
  const [isEditing, setIsEditing] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'income' | 'expense'>('income')
  const [categoryName, setCategoryName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('DollarSign')
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const scrollRefs = {
    income: useRef<HTMLDivElement | null>(null),
    expense: useRef<HTMLDivElement | null>(null),
  }

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryApiService.getAllCategories(),
  })

  const handleAddIncome = () => {
    setModalType('income')
    setIsModalOpen(true)
    setCategoryName('')
    setSelectedIcon('DollarSign')
  }

  const handleAddExpense = () => {
    setModalType('expense')
    setIsModalOpen(true)
    setCategoryName('')
    setSelectedIcon('DollarSign')
  }

  const handleScrollToCustomOptions = (type: 'income' | 'expense') => {
    const el = scrollRefs[type].current
    if (!el) return

    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    })
  }

  const addCategoryMutation = useMutation({
    mutationFn: (payload: CategoryDto) => CategoryApiService.addCategory(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  const handleSubmit = async () => {
    if (!categoryName.trim()) return

    const payload = {
      userId: user?.id || 0,
      name: categoryName.trim(),
      type: modalType,
      icon: selectedIcon,
    }

    await addCategoryMutation.mutateAsync(payload, {
      onSuccess: () => {
        toast.success(`Added ${modalType} category - ${categoryName}`)
        setIsModalOpen(false)
        setCategoryName('')
        setSelectedIcon('DollarSign')
        setTimeout(() => handleScrollToCustomOptions(modalType), 0)
      },
    })
  }

  const SelectedIconComponent = iconOptions.find((opt) => opt.name === selectedIcon)?.icon || DollarSign

  const incomeCategories = categories?.filter((cat) => cat.type === 'income') || []
  const expenseCategories = categories?.filter((cat) => cat.type === 'expense') || []

  return (
    <div className="min-h-[90vh]">
      <div className="max-w-7xl">
        <div className="flex gap-4 flex-col">
          <Label className="text-2xl font-bold">Transaction Categories</Label>
          <Label className="text-gray-400">Add Custom Categories for Income/Expense</Label>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Income Column */}
          <Card className="shadow-lg h-fit relative pb-8">
            <CardHeader className="bg-green-50 border-b py-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-green-800 flex items-center gap-2">Income Categories</CardTitle>
                <div className="flex gap-2">
                  {incomeCategories.length > 0 && (
                    <Button disabled={addCategoryMutation.isPending} onClick={() => handleScrollToCustomOptions('income')} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      <LucideArrowDownNarrowWide className="h-4 w-4 mr-1" />
                      Custom Income Categories
                    </Button>
                  )}
                  <Button disabled={addCategoryMutation.isPending} onClick={handleAddIncome} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent ref={scrollRefs.income} className="p-6 max-h-[50vh] overflow-y-scroll">
              <div className="space-y-3">
                {Object.values(IncomeCategory).map((category) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <span className="font-medium text-gray-700">{formatCategoryName(category)}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Income
                    </Badge>
                  </div>
                ))}
              </div>
              {incomeCategories.length > 0 && (
                <fieldset className="border p-2 mt-4">
                  <legend className="text-xs font-bold">Custom Income Categories</legend>
                  <div className="flex flex-col gap-4">
                    {incomeCategories?.map((cat) => (
                      <CategoryItem isEditing={isEditing} setIsEditing={setIsEditing} type={cat.type} category={cat} key={cat.id} />
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-500/10 to-transparent backdrop-blur-sm rounded-b-sm"></div>
                </fieldset>
              )}
            </CardContent>
          </Card>

          {/* Expense Column */}
          <Card className="shadow-lg h-fit relative pb-8">
            <CardHeader className="bg-red-50 border-b py-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-red-800 flex items-center gap-2">Expense Categories</CardTitle>
                <div className="flex gap-2">
                  {expenseCategories.length > 0 && (
                    <Button disabled={addCategoryMutation.isPending} onClick={() => handleScrollToCustomOptions('expense')} size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      <LucideArrowDownNarrowWide className="h-4 w-4 mr-1" />
                      Custom Expense Categories
                    </Button>
                  )}
                  <Button disabled={addCategoryMutation.isPending} onClick={handleAddExpense} size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent ref={scrollRefs.expense} className="p-6 max-h-[50vh] overflow-y-scroll">
              <div className="space-y-3">
                {Object.values(ExpenseCategory).map((category) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <span className="font-medium text-gray-700">{formatCategoryName(category)}</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Expense
                    </Badge>
                  </div>
                ))}
                {expenseCategories.length > 0 && (
                  <fieldset className="border p-2 mt-4">
                    <legend className="text-xs font-bold">Custom Expense Categories</legend>
                    <div className="flex flex-col gap-4">
                      {expenseCategories?.map((cat) => (
                        <CategoryItem isEditing={isEditing} setIsEditing={setIsEditing} type={cat.type} category={cat} key={cat.id} />
                      ))}
                    </div>
                  </fieldset>
                )}
              </div>
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-red-500/10 to-transparent backdrop-blur-sm rounded-b-sm"></div>
          </Card>
        </div>
      </div>

      {/* Add Category Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${modalType === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <SelectedIconComponent className="h-5 w-5" />
              </div>
              Add {modalType === 'income' ? 'Income' : 'Expense'} Category
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Category Name Input */}
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input id="categoryName" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Enter category name" className="w-full" />
            </div>

            {/* Icon Selection */}
            <div className="space-y-2">
              <Label>Choose Icon</Label>
              <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                {iconOptions.map(({ name, icon: IconComponent }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedIcon(name)}
                    className={`p-3 rounded-lg border-2 transition-colors hover:bg-gray-50 ${
                      selectedIcon === name ? (modalType === 'income' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-200'
                    }`}
                  >
                    <IconComponent className={`h-5 w-5 mx-auto ${selectedIcon === name ? (modalType === 'income' ? 'text-green-600' : 'text-red-600') : 'text-gray-600'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!categoryName.trim() || addCategoryMutation.isPending}
              className={cn(modalType === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700', 'min-w-[8rem]')}
            >
              {addCategoryMutation.isPending ? <Loader className="animate-spin" /> : 'Add Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CategoryPage
