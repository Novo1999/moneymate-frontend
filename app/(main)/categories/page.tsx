'use client'
import CategoryList from '@/app/(main)/categories/components/CategoryList'
import { categoryNameAtom, isModalOpenAtom, modalTypeAtom, selectedIconAtom } from '@/app/(main)/categories/store/categoryAtoms'
import CategoryApiService from '@/app/ApiService/CategoryApiService'
import { CategoryDto } from '@/app/dto/CategoryDto'
import { useAuth } from '@/app/hooks/use-auth'
import { iconOptions } from '@/app/utils/constants'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { DollarSign, Loader } from 'lucide-react'

import { useRef } from 'react'
import { toast } from 'sonner'

const CategoryPage = () => {
  const [isModalOpen, setIsModalOpen] = useAtom(isModalOpenAtom)
  const [modalType] = useAtom(modalTypeAtom)
  const [categoryName, setCategoryName] = useAtom(categoryNameAtom)
  const [selectedIcon, setSelectedIcon] = useAtom(selectedIconAtom)

  const { user } = useAuth()
  const queryClient = useQueryClient()

  const shouldScrollRefs = {
    income: useRef<boolean>(false),
    expense: useRef<boolean>(false),
  }

  const addCategoryMutation = useMutation({
    mutationFn: (payload: CategoryDto) => CategoryApiService.addCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success(`Added ${modalType} category - ${categoryName}`)
      setIsModalOpen(false)
      setCategoryName('')
      setSelectedIcon('DollarSign')
      shouldScrollRefs[modalType].current = true
    },
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
  }

  const SelectedIconComponent = iconOptions.find((opt) => opt.name === selectedIcon)?.icon || DollarSign

  return (
    <div className="min-h-[90vh]">
      <div className="max-w-7xl">
        <div className="flex gap-4 flex-col">
          <Label className="text-2xl font-bold">Transaction Categories</Label>
          <Label className="text-gray-400">Add Custom Categories for Income/Expense</Label>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <CategoryList shouldScrollRef={shouldScrollRefs.income} categoryType="income" />
          <CategoryList shouldScrollRef={shouldScrollRefs.expense} categoryType="expense" />
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
