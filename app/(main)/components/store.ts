import { TransactionModalState } from '@/types/transaction'
import { atom } from 'jotai'

export const transactionModalStateAtom = atom<TransactionModalState>({
  open: false,
  data: {},
})
export const transactionInfoIntervalAtom = atom(new Date().toISOString())
