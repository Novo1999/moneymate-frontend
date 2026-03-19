import CustomCategoryItem from '@/app/(main)/categories/components/CustomCategoryItem'
import { categoryNameAtom, isModalOpenAtom, modalTypeAtom, selectedIconAtom } from '@/app/(main)/categories/store/categoryAtoms'
import { CategoryDto } from '@/app/dto/CategoryDto'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ExpenseCategory, IncomeCategory } from '@/types/categories'
import { useDroppable } from '@dnd-kit/core'
import { useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { RefObject, useEffect, useRef } from 'react'

type CategoryListProp = {
  categoryType: 'income' | 'expense'
  shouldScrollRef: RefObject<boolean>
  // Categories are now fetched in CategoryPage and passed down
  // so the DndContext optimistic updates are the single source of truth
  categories: CategoryDto[]
}

const formatCategoryName = (category: string) => {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const CategoryList = ({ categoryType, shouldScrollRef, categories }: CategoryListProp) => {
  const setIsModalOpen = useSetAtom(isModalOpenAtom)
  const setCategoryName = useSetAtom(categoryNameAtom)
  const setSelectedIcon = useSetAtom(selectedIconAtom)
  const setModalType = useSetAtom(modalTypeAtom)

  // Register this card as a droppable zone; id matches the categoryType string
  const { isOver, setNodeRef } = useDroppable({ id: categoryType })

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const legendRef = useRef<HTMLLegendElement | null>(null)

  const filteredCategories = categories.filter((cat) => cat.type === categoryType)

  // Scroll to custom section after a new item is added
  useEffect(() => {
    if (!shouldScrollRef.current) return
    shouldScrollRef.current = false
    handleScrollToCustomOptions()
  }, [filteredCategories.length])

  const handleScrollToCustomOptions = () => {
    const container = scrollContainerRef.current
    const legend = legendRef.current
    if (!container || !legend) return
    container.scrollTo({ top: legend.offsetTop - 200, behavior: 'smooth' })
  }

  const handleAddCategory = () => {
    setModalType(categoryType)
    setIsModalOpen(true)
    setCategoryName('')
    setSelectedIcon('DollarSign')
  }

  return (
    // ref from useDroppable must go on the outermost element so the whole card is a drop target
    <div ref={setNodeRef} className="h-fit">
      <Card
        className={cn(
          'shadow-lg h-fit relative pb-8 transition-colors duration-200',
          // Highlight the card when a draggable is hovering over it
          isOver && categoryType === 'income' && 'ring-2 ring-green-400 bg-green-50/30',
          isOver && categoryType === 'expense' && 'ring-2 ring-red-400 bg-red-50/30'
        )}
      >
        <CardHeader className={cn('border-b py-6', color.shade[categoryType])}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className={cn('text-xl font-semibold flex items-center gap-2 capitalize', color.text[categoryType])}>
              {categoryType} Categories
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleAddCategory} size="sm" className={color.button[categoryType]}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Drop hint shown only while dragging over */}
          {isOver && (
            <p className={cn('text-xs mt-2 font-medium animate-pulse', categoryType === 'income' ? 'text-green-600' : 'text-red-600')}>
              Drop here to move to {categoryType}
            </p>
          )}
        </CardHeader>

        <CardContent ref={scrollContainerRef} className="p-6 max-h-[50vh] overflow-y-scroll">
          {/* Built-in (non-custom) categories */}
          <div className="space-y-3">
            {Object.values(categoryType === 'income' ? IncomeCategory : ExpenseCategory).map((category) => (
              <div
                key={category}
                className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                <span className="font-medium">{formatCategoryName(category)}</span>
                <Badge variant="secondary" className={cn('capitalize', color.badge[categoryType])}>
                  {categoryType}
                </Badge>
              </div>
            ))}
          </div>

          {/* Custom categories — draggable */}
          {filteredCategories.length > 0 && (
            <fieldset className="border p-2 mt-4">
              <legend ref={legendRef} className="text-xs font-bold capitalize">
                Custom {categoryType} Categories
              </legend>
              <div className="flex flex-col gap-4">
                {filteredCategories.map((cat) => (
                  <CustomCategoryItem type={cat.type} category={cat} key={cat.id} />
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-500/10 to-transparent backdrop-blur-sm rounded-b-sm" />
            </fieldset>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CategoryList

const color = {
  button: {
    income: 'bg-green-600 hover:bg-green-700 text-white',
    expense: 'bg-red-600 hover:bg-red-700 text-white',
  },
  shade: {
    income: 'bg-green-50',
    expense: 'bg-red-50',
  },
  badge: {
    income: 'bg-green-100 text-green-800',
    expense: 'bg-red-100 text-red-800',
  },
  text: {
    income: 'text-green-800',
    expense: 'text-red-800',
  },
}
