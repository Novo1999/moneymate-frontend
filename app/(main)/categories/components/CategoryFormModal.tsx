'use client'
import CategoryIcon from '@/app/(main)/categories/components/CategoryIcon'
import { categoryNameAtom, expenseScrollRefAtom, incomeScrollRefAtom, isEditingAtom, isModalOpenAtom, modalTypeAtom, selectedIconAtom } from '@/app/(main)/categories/store/categoryAtoms'
import CategoryApiService from '@/app/ApiService/CategoryApiService'
import { CategoryDto } from '@/app/dto/CategoryDto'
import { useAuth } from '@/app/hooks/use-auth'
import { FINANCE_ICONS, iconOptions } from '@/app/utils/constants'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'

const CategoryFormModal = () => {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useAtom(isModalOpenAtom)
  const [categoryName, setCategoryName] = useAtom(categoryNameAtom)
  const [selectedIcon, setSelectedIcon] = useAtom(selectedIconAtom)
  const [isEditing, setIsEditing] = useAtom(isEditingAtom)
  const [modalType] = useAtom(modalTypeAtom)
  const { user } = useAuth()
  const [incomeScrollRef] = useAtom(incomeScrollRefAtom)
  const [expenseScrollRef] = useAtom(expenseScrollRefAtom)

  const shouldScrollRefs = {
    income: incomeScrollRef,
    expense: expenseScrollRef,
  }

  const addCategoryMutation = useMutation({
    mutationFn: (payload: CategoryDto) => CategoryApiService.addCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success(`Added ${modalType} category - ${categoryName}`)
      setIsModalOpen(false)
      setCategoryName('')
      setSelectedIcon(iconOptions[0]?.name ?? 'DollarSign')

      shouldScrollRefs[modalType].current = true
    },
  })

  const editCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: { payload: CategoryDto; id?: number | undefined }) => CategoryApiService.editCategory(isEditing || id || 0, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsEditing(0)
      setIsModalOpen(false)
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

    if (isEditing) {
      delete payload.userId
      await editCategoryMutation.mutateAsync({ id: isEditing, payload })
    } else {
      await addCategoryMutation.mutateAsync(payload)
    }
  }

  const mutationPending = editCategoryMutation.isPending || addCategoryMutation.isPending

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${modalType === 'income' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
              <CategoryIcon iconName={selectedIcon} />
            </div>
            {isEditing ? 'Edit' : 'Add'} {modalType === 'income' ? 'Income' : 'Expense'} Category
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input id="categoryName" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Enter category name" className="w-full" />
          </div>

          <div className="space-y-2">
            <Label>Choose Icon</Label>
            <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
              {FINANCE_ICONS.map((icon, index) => (
                <button
                  key={icon + index}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`p-3 rounded-lg border-2 transition-colors hover:bg-gray-50 ${
                    selectedIcon === icon ? (modalType === 'income' ? 'border-primary bg-primary/5' : 'border-destructive bg-destructive/5') : 'border-gray-200'
                  }`}
                >
                  <CategoryIcon className={`h-5 w-5 mx-auto ${selectedIcon === icon ? (modalType === 'income' ? 'text-primary' : 'text-destructive') : 'text-gray-600'}`} iconName={icon} />
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
            disabled={!categoryName.trim() || mutationPending}
            className={cn(modalType === 'income' ? 'bg-primary hover:bg-primary/90' : 'bg-destructive hover:bg-destructive/90', 'min-w-[8rem]')}
          >
            {mutationPending ? <Loader className="animate-spin" /> : isEditing ? 'Edit Category' : 'Add Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default CategoryFormModal
