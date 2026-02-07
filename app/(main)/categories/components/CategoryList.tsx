import CustomCategoryItem from '@/app/(main)/categories/components/CustomCategoryItem'
import { categoryNameAtom, isModalOpenAtom, modalTypeAtom, selectedIconAtom } from '@/app/(main)/categories/store/categoryAtoms'
import CategoryApiService from '@/app/ApiService/CategoryApiService'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ExpenseCategory, IncomeCategory } from '@/types/categories'
import { useQuery } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { Loader, LucideArrowDownNarrowWide, Plus } from 'lucide-react'
import { RefObject, useEffect, useRef } from 'react'

type CategoryListProp = {
  categoryType: 'income' | 'expense'
  shouldScrollRef: RefObject<boolean>
}

const formatCategoryName = (category: string) => {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const CategoryList = ({ categoryType, shouldScrollRef }: CategoryListProp) => {
  const setIsModalOpen = useSetAtom(isModalOpenAtom)
  const setCategoryName = useSetAtom(categoryNameAtom)
  const setSelectedIcon = useSetAtom(selectedIconAtom)
  const setModalType = useSetAtom(modalTypeAtom)

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryApiService.getAllCategories(),
  })

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const legendRef = useRef<HTMLLegendElement | null>(null)
  // scroll to the bottom after submit
  useEffect(() => {
    if (!shouldScrollRef.current) return
    shouldScrollRef.current = false

    handleScrollToCustomOptions()
  }, [categories?.length])

  const filteredCategories = categories?.filter((cat) => cat.type === categoryType) || []

  const handleScrollToCustomOptions = () => {
    const container = scrollContainerRef.current
    const legend = legendRef.current

    if (!container || !legend) return

    const legendTop = legend.offsetTop

    // Scroll the container to the legend
    container.scrollTo({
      top: legendTop - 200,
      behavior: 'smooth',
    })
  }

  const handleAddCategory = () => {
    setModalType(categoryType)
    setIsModalOpen(true)
    setCategoryName('')
    setSelectedIcon('DollarSign')
  }

  return isCategoriesLoading ? (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Loader className="animate-spin text-green-500" />
    </div>
  ) : (
    <Card className="shadow-lg h-fit relative pb-8">
      <CardHeader className={cn('border-b py-6', color.shade[categoryType])}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className={cn('text-xl font-semibold flex items-center gap-2 capitalize', color.text[categoryType])}>{categoryType} Categories</CardTitle>
          <div className="flex gap-2 flex-wrap">
            {filteredCategories.length > 0 && (
              <Button onClick={handleScrollToCustomOptions} size="sm" className={color.button[categoryType]}>
                <LucideArrowDownNarrowWide className="h-4 w-4 mr-1" />
                <p className="capitalize">Custom {categoryType} Categories</p>
              </Button>
            )}
            <Button onClick={handleAddCategory} size="sm" className={color.button[categoryType]}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent ref={scrollContainerRef} className="p-6 max-h-[50vh] overflow-y-scroll">
        <div className="space-y-3">
          {Object.values(categoryType === 'income' ? IncomeCategory : ExpenseCategory).map((category) => (
            <div key={category} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <span className="font-medium text-gray-700">{formatCategoryName(category)}</span>
              <Badge variant="secondary" className={cn('capitalize', color.badge[categoryType])}>
                {categoryType}
              </Badge>
            </div>
          ))}
        </div>
        {filteredCategories.length > 0 && (
          <fieldset className="border p-2 mt-4">
            <legend ref={legendRef} className="text-xs font-bold capitalize">
              Custom {categoryType} Categories
            </legend>
            <div className="flex flex-col gap-4">
              {filteredCategories?.map((cat) => (
                <CustomCategoryItem type={cat.type} category={cat} key={cat.id} />
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-500/10 to-transparent backdrop-blur-sm rounded-b-sm"></div>
          </fieldset>
        )}
      </CardContent>
    </Card>
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
