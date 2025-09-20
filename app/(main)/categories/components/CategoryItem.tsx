import CategoryApiService from '@/app/ApiService/CategoryApiService'
import { CategoryDto } from '@/app/dto/CategoryDto'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SetStateAction } from 'jotai'
import { ArrowLeft, ArrowLeftRight, ArrowRight, Pen, Trash, X } from 'lucide-react'
import { Dispatch, useState } from 'react'

type CategoryItemProp = {
  category: CategoryDto
  type: 'income' | 'expense'
  isEditing: number
  setIsEditing: Dispatch<SetStateAction<number>>
}

const CategoryItem = ({ category, type, setIsEditing, isEditing }: CategoryItemProp) => {
  const [inputVal, setInputVal] = useState(category.name)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const queryClient = useQueryClient()

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

  return (
    <div key={category.id} className="flex items-center justify-between p-3 group *:transition-all *:duration-300 bg-white border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
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

      <div className="flex gap-2">
        {isEditing !== category.id && (
          <Badge variant="secondary" className={cn('group-hover:hidden capitalize', type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
            {type}
          </Badge>
        )}
        <Badge
          onClick={() => !operationsDisabled && setIsEditing((prev) => (prev === category.id ? 0 : category.id || 0))}
          variant={operationsDisabled ? 'disabled' : 'secondary'}
          className={cn('bg-green-100 hover:bg-green-200 text-green-800 gap-2', isEditing === category.id ? 'flex' : 'group-hover:flex hidden')}
        >
          {isEditing === category.id ? <X /> : <Pen />}
          {isEditing === category.id ? 'Close' : 'Edit'}
        </Badge>
        <Badge
          onClick={() => setShowDeleteModal(true)}
          variant={operationsDisabled ? 'disabled' : 'destructive'}
          className={cn('group-hover:flex hover:bg-red-700 hidden gap-2', isEditing === category.id ? 'flex' : 'group-hover:flex hidden')}
        >
          <Trash />
          Delete
        </Badge>
        <Badge
          variant={operationsDisabled ? 'disabled' : 'outline'}
          title={`Move to ${type}`}
          onClick={() => handleEditCategory(category.id, type === 'income' ? 'expense' : 'income')}
          className={cn('group-hover:flex hover:bg-white hidden text-black gap-2', isEditing === category.id ? 'flex' : 'group-hover:flex hidden')}
        >
          {type === 'expense' ? <ArrowLeft /> : <ArrowRight />}
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

export default CategoryItem
