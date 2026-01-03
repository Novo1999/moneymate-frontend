import { EditAccountDetailsDto } from '@/app/dto/EditAccountDetailsDto'
import { AccountType } from '@/types/account'
import { atom } from 'jotai'

const editOpenAtom = atom<boolean>(false),
  editFormAtom = atom<EditAccountDetailsDto>({ name: '' }),
  transferOpenAtom = atom<boolean>(false),
  transferFormAtom = atom({ toAccountId: 0, fromAccountId: 0, amount: 0, note: '' }),
  markedAccountAtom = atom<AccountType[]>([])

export { editFormAtom, editOpenAtom, markedAccountAtom, transferFormAtom, transferOpenAtom }
