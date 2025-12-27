import { EditAccountDetailsDto } from '@/app/dto/EditAccountDetailsDto'
import { atom } from 'jotai'

export const editOpenAtom = atom<boolean>(false)
export const editFormAtom = atom<EditAccountDetailsDto>({
  name: '',
})
