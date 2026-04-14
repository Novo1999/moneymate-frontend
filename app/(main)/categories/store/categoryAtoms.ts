import { CategoryDto } from '@/app/dto/CategoryDto'
import { atom } from 'jotai'
import { RefObject } from 'react'

export const isEditingAtom = atom<number>(0)

export const isModalOpenAtom = atom<boolean>(false)

export const modalTypeAtom = atom<'income' | 'expense'>('income')

export const categoryNameAtom = atom<string>('')

export const selectedIconAtom = atom<string>('DollarSign')

export const activeDragItemAtom = atom<CategoryDto | null>(null)

export const incomeScrollRefAtom = atom<RefObject<boolean>>({ current: false })
export const expenseScrollRefAtom = atom<RefObject<boolean>>({ current: false })
