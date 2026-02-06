import { TRANSACTION_CATEGORY_LABEL } from '@/app/utils/constants'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from '@/components/ui/menubar'
import { ExpenseCategory, IncomeCategory } from '@/types/categories'
import { Check, X } from 'lucide-react'

type Props = {
  value: string
  onChange: (category: IncomeCategory | ExpenseCategory) => void
  onClear: () => void
}

const formatCategoryLabel = (category: string) =>
  category
    .split('_')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')

const CategoryFilter = ({ value, onChange, onClear }: Props) => {
  return (
    <div className="flex items-center gap-1">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger className="capitalize truncate">
            {value && <span>Category : </span>}
            {TRANSACTION_CATEGORY_LABEL[value] || 'Category'}
          </MenubarTrigger>

          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>Income</MenubarSubTrigger>
              <MenubarSubContent>
                {Object.values(IncomeCategory).map((category) => (
                  <MenubarItem key={category} onClick={() => onChange(category)} className="flex items-center justify-between">
                    {formatCategoryLabel(category)}
                    {value === category && <Check className="h-4 w-4 ml-2" />}
                  </MenubarItem>
                ))}
              </MenubarSubContent>
            </MenubarSub>

            <MenubarSeparator />

            <MenubarSub>
              <MenubarSubTrigger>Expense</MenubarSubTrigger>
              <MenubarSubContent>
                {Object.values(ExpenseCategory).map((category) => (
                  <MenubarItem key={category} onClick={() => onChange(category)} className="flex items-center justify-between">
                    {formatCategoryLabel(category)}
                    {value === category && <Check className="h-4 w-4 ml-2" />}
                  </MenubarItem>
                ))}
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
