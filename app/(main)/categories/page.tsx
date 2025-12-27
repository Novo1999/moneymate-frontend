'use client'
import CategoryItem from '@/app/(main)/categories/components/CategoryItem'
import CategoryApiService from '@/app/ApiService/CategoryApiService'
import { CategoryDto } from '@/app/dto/CategoryDto'
import { useAuth } from '@/app/hooks/use-auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { ExpenseCategory, IncomeCategory } from '@/types/categories'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Award,
  Briefcase,
  Building,
  Car,
  Coffee,
  CreditCard,
  Crown,
  Diamond,
  DollarSign,
  Gamepad2,
  Gift,
  Heart,
  Home,
  Loader,
  Music,
  Phone,
  PiggyBank,
  Plus,
  ShoppingCart,
  Star,
  Target,
  TrendingUp,
  Users,
  Utensils,
  Wallet,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

const formatCategoryName = (category: string) => {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Predefined icons to choose from
const iconOptions = [
  { name: 'DollarSign', icon: DollarSign },
  { name: 'Home', icon: Home },
  { name: 'Car', icon: Car },
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'Utensils', icon: Utensils },
  { name: 'Gamepad2', icon: Gamepad2 },
  { name: 'Phone', icon: Phone },
  { name: 'CreditCard', icon: CreditCard },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Gift', icon: Gift },
  { name: 'Award', icon: Award },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Building', icon: Building },
  { name: 'Coffee', icon: Coffee },
  { name: 'Music', icon: Music },
  { name: 'Heart', icon: Heart },
  { name: 'Zap', icon: Zap },
  { name: 'Wallet', icon: Wallet },
  { name: 'PiggyBank', icon: PiggyBank },
  { name: 'Target', icon: Target },
  { name: 'Users', icon: Users },
  { name: 'Star', icon: Star },
  { name: 'Crown', icon: Crown },
  { name: 'Diamond', icon: Diamond },
]

const CategoryPage = () => {
  const [isEditing, setIsEditing] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'income' | 'expense'>('income')
  const [categoryName, setCategoryName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('DollarSign')
  const { user } = useAuth()
  const queryClient = useQueryClient()

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

    await addCategoryMutation.mutateAsync(payload)

    setIsModalOpen(false)
    setCategoryName('')
    setSelectedIcon('DollarSign')
  }

  const SelectedIconComponent = iconOptions.find((opt) => opt.name === selectedIcon)?.icon || DollarSign

  const incomeCategories = categories?.filter((cat) => cat.type === 'income')
  const expenseCategories = categories?.filter((cat) => cat.type === 'expense')

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
                <Button disabled={addCategoryMutation.isPending} onClick={handleAddIncome} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 max-h-[50vh] overflow-y-scroll">
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
              {(incomeCategories?.length || 0) > 0 && (
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
                <Button disabled={addCategoryMutation.isPending} onClick={handleAddExpense} size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 max-h-[50vh] overflow-y-scroll">
              <div className="space-y-3">
                {Object.values(ExpenseCategory).map((category) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <span className="font-medium text-gray-700">{formatCategoryName(category)}</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Expense
                    </Badge>
                  </div>
                ))}
                {(expenseCategories?.length || 0) > 0 && (
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
