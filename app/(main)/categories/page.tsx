import CategoriesContainer from '@/app/(main)/categories/components/CategoriesContainer'
import CategoriesDndWrapper from '@/app/(main)/categories/components/CategoriesDndWrapper'
import CategoryDragOverlay from '@/app/(main)/categories/components/CategoryDragOverlay'
import CategoryLists from '@/app/(main)/categories/components/CategoryLists'

export default function CategoryPage() {
  return (
    <CategoriesDndWrapper>
      <CategoriesContainer>
        <CategoryLists />
      </CategoriesContainer>
      <CategoryDragOverlay />
    </CategoriesDndWrapper>
  )
}
