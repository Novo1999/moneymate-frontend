import CategoryIcon from '@/app/(main)/categories/components/CategoryIcon'
import CategoryApiService from '@/app/ApiService/CategoryApiService'
import { TRANSACTION_CATEGORY_LABEL } from '@/app/utils/constants'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from '@/components/ui/menubar'
import { Skeleton } from '@/components/ui/skeleton'
import { ExpenseCategory, getCategoryIcon, IncomeCategory } from '@/types/categories'
import { useQuery } from '@tanstack/react-query'
import { Check, X } from 'lucide-react'

type Props = {
  value: string
  onChange: (category: IncomeCategory | ExpenseCategory | string) => void
  onClear: () => void
}

const formatCategoryLabel = (category: string) =>
  category
    .split('_')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')

const CategoryFilter = ({ value, onChange, onClear }: Props) => {
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryApiService.getAllCategories(),
  })
  const filteredIncomeCategories = categories?.filter((cat) => cat.type === 'income') || []
  const filteredExpenseCategories = categories?.filter((cat) => cat.type === 'expense') || []

  return (
    <div className="flex items-center gap-1">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger className="capitalize truncate flex items-center gap-2">
            {value ? (
              <>
                <CategoryIcon iconName={getCategoryIcon(value as IncomeCategory | ExpenseCategory)} />
                <span>Category : {TRANSACTION_CATEGORY_LABEL[value]}</span>
              </>
            ) : (
              'Category'
            )}
          </MenubarTrigger>

          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>Income</MenubarSubTrigger>
              <MenubarSubContent className="max-h-60 overflow-auto">
                {Object.values(IncomeCategory).map((category) => (
                  <MenubarItem key={category} onClick={() => onChange(category)} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CategoryIcon iconName={getCategoryIcon(category, 'income')} />
                      {formatCategoryLabel(category)}
                    </div>
                    {value === category && <Check className="h-4 w-4" />}
                  </MenubarItem>
                ))}
                {isCategoriesLoading ? (
                  <Skeleton className='min-h-5 bg-primary' />
                ) : (
                  filteredIncomeCategories?.map((category) => (
                    <MenubarItem key={category.id} onClick={() => onChange(category.name)} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <CategoryIcon iconName={category.icon} />
                        {formatCategoryLabel(category.name)}
                      </div>
                      {value === category.name && <Check className="h-4 w-4" />}
                    </MenubarItem>
                  ))
                )}
              </MenubarSubContent>
            </MenubarSub>

            <MenubarSeparator />

            <MenubarSub>
              <MenubarSubTrigger>Expense</MenubarSubTrigger>
              <MenubarSubContent className="max-h-60 overflow-auto">
                {Object.values(ExpenseCategory).map((category) => (
                  <MenubarItem key={category} onClick={() => onChange(category)} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CategoryIcon iconName={getCategoryIcon(category, 'expense')} />
                      {formatCategoryLabel(category)}
                    </div>
                    {value === category && <Check className="h-4 w-4" />}
                  </MenubarItem>
                ))}

                {isCategoriesLoading ? (
                  <Skeleton className='min-h-5 bg-primary' />
                ) : (
                  filteredExpenseCategories?.map((category) => (
                    <MenubarItem key={category.id} onClick={() => onChange(category.name)} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <CategoryIcon iconName={category.icon} />
                        {formatCategoryLabel(category.name)}
                      </div>
                      {value === category.name && <Check className="h-4 w-4" />}
                    </MenubarItem>
                  ))
                )}
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {value && (
        <button onClick={onClear} className="hover:bg-primary hover:text-white rounded-full p-1 transition-colors" aria-label="Clear category filter">
          <X size={20} />
        </button>
      )}
    </div>
  )
}

export default CategoryFilter
