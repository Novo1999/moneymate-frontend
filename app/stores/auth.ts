import { UserDto } from '@/app/dto/UserDto'
import { atom } from 'jotai'

export const userAtom = atom<UserDto | null>(null)
export const tokenAtom = atom<string | null>(null)
export const authLoadingAtom = atom<boolean>(true)
