'use client'
import CategoryList from '@/app/(main)/categories/components/CategoryList'
import { expenseScrollRefAtom, incomeScrollRefAtom } from '@/app/(main)/categories/store/categoryAtoms'
import { useAtom } from 'jotai'

const CategoryLists = () => {
  const [incomeScrollRef] = useAtom(incomeScrollRefAtom)
  const [expenseScrollRef] = useAtom(expenseScrollRefAtom)

  return (
    <>
      <CategoryList shouldScrollRef={incomeScrollRef} categoryType="income" />
      <CategoryList shouldScrollRef={expenseScrollRef} categoryType="expense" />
    </>
  )
}
export default CategoryLists
