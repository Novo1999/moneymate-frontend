import CustomCategoryItem from '@/app/(main)/categories/components/CustomCategoryItem'
import { categoryNameAtom, isModalOpenAtom, modalTypeAtom, selectedIconAtom } from '@/app/(main)/categories/store/categoryAtoms'
import CategoryApiService from '@/app/ApiService/CategoryApiService'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCategoryName } from '@/lib/category'
import { cn } from '@/lib/utils'
import { ExpenseCategory, IncomeCategory } from '@/types/categories'
import { useDroppable } from '@dnd-kit/core'
import { useQuery } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { RefObject, useEffect, useRef } from 'react'

type CategoryListProp = {
  categoryType: 'income' | 'expense'
  shouldScrollRef: RefObject<boolean>
}

const CategoryList = ({ categoryType, shouldScrollRef }: CategoryListProp) => {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryApiService.getAllCategories(),
  })

  const setIsModalOpen = useSetAtom(isModalOpenAtom)
  const setCategoryName = useSetAtom(categoryNameAtom)
  const setSelectedIcon = useSetAtom(selectedIconAtom)
  const setModalType = useSetAtom(modalTypeAtom)

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

  const isIncome = categoryType === 'income'

  return (
    <div ref={setNodeRef} className="h-fit">
      <Card
        className={cn(
          'custom-card h-fit relative pb-8 transition-all duration-200',
          isOver && isIncome && 'ring-2 ring-primary bg-primary/5',
          isOver && !isIncome && 'ring-2 ring-destructive bg-destructive/5',
        )}
      >
        <CardHeader className={cn('border-b py-6', isIncome ? 'bg-primary/5' : 'bg-destructive/5')}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className={cn('text-xl font-bold flex items-center gap-2 capitalize', isIncome ? 'text-primary' : 'text-destructive')}>{categoryType} Categories</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleAddCategory} size="sm" variant={isIncome ? 'default' : 'destructive'}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {isOver && <p className={cn('text-xs mt-2 font-semibold animate-pulse', isIncome ? 'text-primary' : 'text-destructive')}>Drop here to move to {categoryType}</p>}
        </CardHeader>

        <CardContent ref={scrollContainerRef} className="p-6 max-h-[50vh] overflow-y-auto">
          <div className="space-y-3">
            {Object.values(isIncome ? IncomeCategory : ExpenseCategory).map((category) => (
              <div key={category} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm hover:border-primary/30 transition-all cursor-pointer">
                <span className="font-medium">{formatCategoryName(category)}</span>
                <Badge
                  variant={isIncome ? 'outline' : 'secondary'}
                  className={cn('capitalize font-semibold', isIncome ? 'border-primary/30 text-primary' : 'bg-destructive/10 text-destructive border-transparent')}
                >
                  {categoryType}
                </Badge>
              </div>
            ))}
          </div>

          {filteredCategories.length > 0 && (
            <fieldset className="border border-dashed rounded-lg p-4 mt-6">
              <legend ref={legendRef} className="text-[10px] font-bold uppercase tracking-widest px-2 text-muted-foreground">
                Custom {categoryType}
              </legend>
              <div className="flex flex-col gap-3">
                {filteredCategories.map((cat) => (
                  <CustomCategoryItem type={cat.type} category={cat} key={cat.id} />
                ))}
              </div>
            </fieldset>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CategoryList
