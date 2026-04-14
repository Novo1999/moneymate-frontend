import CategoryIcon from '@/app/(main)/categories/components/CategoryIcon'
import { categoryNameAtom, isEditingAtom, isModalOpenAtom, modalTypeAtom, selectedIconAtom } from '@/app/(main)/categories/store/categoryAtoms'
import CategoryApiService from '@/app/ApiService/CategoryApiService'
import { CategoryDto } from '@/app/dto/CategoryDto'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom, useSetAtom } from 'jotai'
import { GripVertical, Pen, Trash } from 'lucide-react'
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

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: category.id!,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1,
    transition: isDragging ? undefined : 'opacity 200ms ease',
  }

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

  const operationsDisabled = editCategoryMutation.isPending || deleteCategoryMutation.isPending

  const handleDeleteCategory = () => !operationsDisabled && deleteCategoryMutation.mutateAsync()

  const handleEditOpen = (category: CategoryDto) => {
    setIsModalOpen(true)
    setIsEditing(category.id || 0)
    setCategoryName(category.name)
    setSelectedIcon(category.icon)
    setModalType(category.type)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      key={category.id}
      className="flex items-center flex-wrap gap-2 justify-between p-3 group *:transition-all *:duration-300 border rounded-lg hover:shadow-md transition-shadow"
    >
      <div className="flex gap-2 items-center">
        <button
          {...listeners}
          {...attributes}
          className={cn(
            'cursor-grab active:cursor-grabbing p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 touch-none',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
            type === 'income' ? 'focus-visible:ring-green-500' : 'focus-visible:ring-red-500',
          )}
          aria-label="Drag to move category"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <CategoryIcon iconName={category.icon} />
        <span className="font-medium">{category.name}</span>
      </div>

      <div className="flex gap-2">
        {isEditing !== category.id && (
          <Badge variant="secondary" className={cn('capitalize lg:group-hover:hidden', type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
            {type}
          </Badge>
        )}

        <Badge
          onClick={() => !operationsDisabled && handleEditOpen(category)}
          variant={operationsDisabled ? 'disabled' : 'secondary'}
          className={cn('bg-green-100 hover:bg-green-200 text-green-800 gap-2', isEditing === category.id ? 'flex' : 'flex lg:hidden lg:group-hover:flex', 'cursor-pointer')}
        >
          <Pen />
          Edit
        </Badge>

        <Badge
          onClick={() => setShowDeleteModal(true)}
          variant={operationsDisabled ? 'disabled' : 'destructive'}
          className={cn('hover:bg-red-700 gap-2', isEditing === category.id ? 'flex' : 'flex lg:hidden lg:group-hover:flex', 'cursor-pointer')}
        >
          <Trash />
          Delete
        </Badge>
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
