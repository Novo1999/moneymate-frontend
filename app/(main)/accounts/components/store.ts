import { EditAccountDetailsDto } from '@/app/dto/EditAccountDetailsDto'
import { AccountType } from '@/types/account'
import { atom } from 'jotai'

const editOpenAtom = atom<boolean>(false),
  editFormAtom = atom<EditAccountDetailsDto>({ name: '' }),
  transferOpenAtom = atom<boolean>(false),
  transferFormAtom = atom({ toAccountId: 0, amount: 0, description: '' }),
  markedAccountAtom = atom<AccountType[]>([])

export { editFormAtom, editOpenAtom, markedAccountAtom, transferFormAtom, transferOpenAtom }

