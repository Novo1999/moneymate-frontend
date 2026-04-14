import CategoryFormModal from '@/app/(main)/categories/components/CategoryFormModal'
import { Label } from '@/components/ui/label'
import { ReactNode } from 'react'

const CategoriesContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-[90vh] max-w-7xl mx-auto">
      <div>
        <div className="flex gap-4 flex-col">
          <Label className="text-2xl font-bold">Transaction Categories</Label>
          <Label className="text-gray-400">Add Custom Categories for Income/Expense</Label>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">{children}</div>
      </div>
      <CategoryFormModal />
    </div>
  )
}
export default CategoriesContainer
