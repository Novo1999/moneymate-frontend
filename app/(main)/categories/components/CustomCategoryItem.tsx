import CategoryIcon from '@/app/(main)/categories/components/CategoryIcon'
import { categoryNameAtom, isEditingAtom, isModalOpenAtom, modalTypeAtom, selectedIconAtom } from '@/app/(main)/categories/store/categoryAtoms'
import CategoryApiService from '@/app/ApiService/CategoryApiService'
import { CategoryDto } from '@/app/dto/CategoryDto'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom, useSetAtom } from 'jotai'
import { ArrowLeft, ArrowRight, Pen, Trash, X } from 'lucide-react'
import { useState } from 'react'

type CustomCategoryItemProp = {
  category: CategoryDto
  type: 'income' | 'expense'
}

const CustomCategoryItem = ({ category, type }: CustomCategoryItemProp) => {
  const [isEditing, setIsEditing] = useAtom(isEditingAtom)
  const [inputVal, setInputVal] = useState(category.name)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const queryClient = useQueryClient()
  const setIsModalOpen = useSetAtom(isModalOpenAtom)
  const setCategoryName = useSetAtom(categoryNameAtom)
  const setSelectedIcon = useSetAtom(selectedIconAtom)
  const setModalType = useSetAtom(modalTypeAtom)

  const editCategoryMutation = useMutation({
    mutationFn: ({ id, type }: { type?: CategoryDto['type'] | undefined; id?: number | undefined }) => CategoryApiService.editCategory(isEditing || id || 0, { name: inputVal, ...(type && { type }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsEditing(0)
      setInputVal('')
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: () => CategoryApiService.deleteCategory(category.id || 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsEditing(0)
      setShowDeleteModal(false)
    },
  })

  const operationsDisabled = editCategoryMutation?.isPending || deleteCategoryMutation?.isPending

  const handleEditCategory = (id?: number | undefined, type?: CategoryDto['type'] | undefined) => !operationsDisabled && inputVal && editCategoryMutation.mutateAsync({ id, type })
  const handleDeleteCategory = () => !operationsDisabled && deleteCategoryMutation.mutateAsync()

  const handleEditOpen = (category: CategoryDto) => {
    setIsModalOpen(true)
    setIsEditing(category.id || 0)
    setCategoryName(category.name)
    setSelectedIcon(category.icon)
    setModalType(category.type)
  }

  const categoryMover = (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant={operationsDisabled ? 'disabled' : 'outline'}
          onClick={() => handleEditCategory(category.id, type === 'income' ? 'expense' : 'income')}
          className={cn('hover:bg-white text-black gap-2', isEditing === category.id ? 'flex' : 'flex lg:hidden lg:group-hover:flex')}
        >
          {type === 'expense' ? <ArrowLeft className="rotate-90 lg:rotate-0" /> : <ArrowRight className="rotate-90 lg:rotate-0" />}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p className="capitalize">Move to {type === 'income' ? 'expense' : 'income'}</p>
      </TooltipContent>
    </Tooltip>
  )

  return (
    <div
      key={category.id}
      className="flex items-center flex-wrap gap-2 justify-between p-3 group *:transition-all *:duration-300 bg-white border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex gap-2 items-center">
        <CategoryIcon iconName={category.icon} />
        {isEditing === category.id ? (
          <Input
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEditCategory()
            }}
            value={inputVal}
            className="mr-4"
            onChange={(e) => setInputVal(e.target.value)}
            autoFocus
          />
        ) : (
          <span className="font-medium text-gray-700">{category.name}</span>
        )}
      </div>
      <div className="flex gap-2">
        {isEditing !== category.id && (
          <Badge variant="secondary" className={cn('capitalize lg:group-hover:hidden', type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
            {type}
          </Badge>
        )}
        {type === 'expense' && categoryMover}
        <Badge
          onClick={() => !operationsDisabled && handleEditOpen(category)}
          variant={operationsDisabled ? 'disabled' : 'secondary'}
          className={cn('bg-green-100 hover:bg-green-200 text-green-800 gap-2', isEditing === category.id ? 'flex' : 'flex lg:hidden lg:group-hover:flex')}
        >
          {isEditing === category.id ? <X /> : <Pen />}
          {isEditing === category.id ? 'Close' : 'Edit'}
        </Badge>
        <Badge
          onClick={() => setShowDeleteModal(true)}
          variant={operationsDisabled ? 'disabled' : 'destructive'}
          className={cn('hover:bg-red-700 gap-2', isEditing === category.id ? 'flex' : 'flex lg:hidden lg:group-hover:flex')}
        >
          <Trash />
          Delete
        </Badge>
        {type === 'income' && categoryMover}
      </div>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>Are you sure you want to delete {category.name}? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory} disabled={deleteCategoryMutation.isPending}>
              {deleteCategoryMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CustomCategoryItem
