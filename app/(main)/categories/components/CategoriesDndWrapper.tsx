'use client'

import { activeDragItemAtom } from '@/app/(main)/categories/store/categoryAtoms'
import CategoryApiService from '@/app/ApiService/CategoryApiService'
import { CategoryDto } from '@/app/dto/CategoryDto'
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { ReactNode } from 'react'
import { toast } from 'sonner'

const CategoriesDndWrapper = ({ children }: { children: ReactNode }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryApiService.getAllCategories(),
  })
  const setActiveDragItem = useSetAtom(activeDragItemAtom)
  const queryClient = useQueryClient()

  const handleDragStart = (event: DragStartEvent) => {
    const dragged = categories.find((cat) => cat.id === event.active.id)
    setActiveDragItem(dragged ?? null)
  }

  const moveCategoryMutation = useMutation({
    mutationFn: ({ id, newType }: { id: number; newType: 'income' | 'expense' }) => CategoryApiService.editCategory(id, { type: newType }),
    onMutate: async ({ id, newType }) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] })
      const previous = queryClient.getQueryData<CategoryDto[]>(['categories'])
      queryClient.setQueryData<CategoryDto[]>(['categories'], (old = []) => old.map((cat) => (cat.id === id ? { ...cat, type: newType } : cat)))
      return { previous }
    },
    onError: (_err, { newType }, context) => {
      queryClient.setQueryData(['categories'], context?.previous)
      const from = newType === 'income' ? 'expense' : 'income'
      toast.error(`Failed to move category from ${from} to ${newType}`)
    },
    onSuccess: (_data, { newType }) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success(`Category moved to ${newType}`)
    },
  })

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragItem(null)

    const { active, over } = event
    if (!over) return

    const targetType = over.id as 'income' | 'expense'
    const dragged = categories.find((cat) => cat.id === active.id)

    if (!dragged) return
    if (dragged.type === targetType) return

    moveCategoryMutation.mutate({ id: dragged.id!, newType: targetType })
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {children}
    </DndContext>
  )
}
export default CategoriesDndWrapper
