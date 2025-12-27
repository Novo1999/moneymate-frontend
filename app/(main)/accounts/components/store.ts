import { atom } from 'jotai'

export const editOpenAtom = atom<boolean>(false)
export const editFormAtom = atom({
  name: '',
  type: '',
  balance: 0,
  description: '',
})
