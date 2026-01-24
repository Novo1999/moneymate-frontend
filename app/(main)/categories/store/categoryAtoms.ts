import { atom } from 'jotai'

export const isEditingAtom = atom<number>(0)

export const isModalOpenAtom = atom<boolean>(false)

export const modalTypeAtom = atom<'income' | 'expense'>('income')

export const categoryNameAtom = atom<string>('')

export const selectedIconAtom = atom<string>('DollarSign')
