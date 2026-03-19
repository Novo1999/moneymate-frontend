'use client'
import CategoryIcon from '@/app/(main)/categories/components/CategoryIcon'
import CategoryList from '@/app/(main)/categories/components/CategoryList'
import { categoryNameAtom, isEditingAtom, isModalOpenAtom, modalTypeAtom, selectedIconAtom } from '@/app/(main)/categories/store/categoryAtoms'
import CategoryApiService from '@/app/ApiService/CategoryApiService'
import { CategoryDto } from '@/app/dto/CategoryDto'
import { useAuth } from '@/app/hooks/use-auth'
import { FINANCE_ICONS, iconOptions } from '@/app/utils/constants'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { Loader } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

const CategoryPage = () => {
  const [isModalOpen, setIsModalOpen] = useAtom(isModalOpenAtom)
  const [modalType] = useAtom(modalTypeAtom)
  const [categoryName, setCategoryName] = useAtom(categoryNameAtom)
  const [selectedIcon, setSelectedIcon] = useAtom(selectedIconAtom)
  const [isEditing, setIsEditing] = useAtom(isEditingAtom)

  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Track which item is being dragged for the DragOverlay
  const [activeDragItem, setActiveDragItem] = useState<CategoryDto | null>(null)

  const shouldScrollRefs = {
    income: useRef<boolean>(false),
    expense: useRef<boolean>(false),
  }

  // Fetch categories at this level so we can do optimistic updates here
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryApiService.getAllCategories(),
  })

  // Require 8px of movement before a drag starts — prevents accidental drags on clicks
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const moveCategoryMutation = useMutation({
    mutationFn: ({ id, newType }: { id: number; newType: 'income' | 'expense' }) =>
      CategoryApiService.editCategory(id, { type: newType }),
    onMutate: async ({ id, newType }) => {
      // Cancel any in-flight refetches so they don't overwrite the optimistic update
      await queryClient.cancelQueries({ queryKey: ['categories'] })
      // Snapshot the previous value for rollback
      const previous = queryClient.getQueryData<CategoryDto[]>(['categories'])
      // Optimistically flip the type in the cache
      queryClient.setQueryData<CategoryDto[]>(['categories'], (old = []) =>
        old.map((cat) => (cat.id === id ? { ...cat, type: newType } : cat))
      )
      return { previous }
    },
    onError: (_err, { newType }, context) => {
      // Roll back to the snapshot on failure
      queryClient.setQueryData(['categories'], context?.previous)
      const from = newType === 'income' ? 'expense' : 'income'
      toast.error(`Failed to move category from ${from} to ${newType}`)
    },
    onSuccess: (_data, { newType }) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success(`Category moved to ${newType}`)
    },
  })

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
    mutationFn: ({ id, payload }: { payload: CategoryDto; id?: number | undefined }) =>
      CategoryApiService.editCategory(isEditing || id || 0, payload),
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

  const handleDragStart = (event: DragStartEvent) => {
    const dragged = categories.find((cat) => cat.id === event.active.id)
    setActiveDragItem(dragged ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragItem(null)

    const { active, over } = event
    if (!over) return

    // The droppable zone id is the list type: 'income' or 'expense'
    const targetType = over.id as 'income' | 'expense'
    const dragged = categories.find((cat) => cat.id === active.id)

    if (!dragged) return
    // No-op if dropped back onto its own list
    if (dragged.type === targetType) return

    moveCategoryMutation.mutate({ id: dragged.id!, newType: targetType })
  }

  const mutationPending = editCategoryMutation.isPending || addCategoryMutation.isPending

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-[90vh] max-w-7xl mx-auto">
        <div>
          <div className="flex gap-4 flex-col">
            <Label className="text-2xl font-bold">Transaction Categories</Label>
            <Label className="text-gray-400">Add Custom Categories for Income/Expense</Label>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            <CategoryList
              categories={categories}
              shouldScrollRef={shouldScrollRefs.income}
              categoryType="income"
            />
            <CategoryList
              categories={categories}
              shouldScrollRef={shouldScrollRefs.expense}
              categoryType="expense"
            />
          </div>
        </div>

        {/* Add / Edit Category Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${modalType === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  <CategoryIcon iconName={selectedIcon} />
                </div>
                {isEditing ? 'Edit' : 'Add'} {modalType === 'income' ? 'Income' : 'Expense'} Category
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full"
                />
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
                        selectedIcon === icon
                          ? modalType === 'income'
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <CategoryIcon
                        className={`h-5 w-5 mx-auto ${
                          selectedIcon === icon
                            ? modalType === 'income'
                              ? 'text-green-600'
                              : 'text-red-600'
                            : 'text-gray-600'
                        }`}
                        iconName={icon}
                      />
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
                className={cn(
                  modalType === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700',
                  'min-w-[8rem]'
                )}
              >
                {mutationPending ? <Loader className="animate-spin" /> : isEditing ? 'Edit Category' : 'Add Category'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Floating ghost preview that follows the cursor while dragging */}
      <DragOverlay>
        {activeDragItem ? (
          <div className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-dashed border-gray-400 rounded-lg shadow-xl opacity-90 cursor-grabbing w-fit">
            <CategoryIcon iconName={activeDragItem.icon} />
            <span className="font-medium text-sm">{activeDragItem.name}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default CategoryPage
