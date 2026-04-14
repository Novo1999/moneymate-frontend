'use client'
import CategoryIcon from '@/app/(main)/categories/components/CategoryIcon'
import { activeDragItemAtom } from '@/app/(main)/categories/store/categoryAtoms'
import { DragOverlay } from '@dnd-kit/core'
import { useAtomValue } from 'jotai'

const CategoryDragOverlay = () => {
  const activeDragItem = useAtomValue(activeDragItemAtom)

  return (
    <DragOverlay>
      {activeDragItem ? (
        <div className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-dashed border-gray-400 rounded-lg shadow-xl opacity-90 cursor-grabbing w-fit">
          <CategoryIcon iconName={activeDragItem.icon} />
          <span className="font-medium text-sm">{activeDragItem.name}</span>
        </div>
      ) : null}
    </DragOverlay>
  )
}
export default CategoryDragOverlay
