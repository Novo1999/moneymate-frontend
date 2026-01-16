import { UserDto } from '@/app/dto/UserDto'
import { atom } from 'jotai'

export const userAtom = atom<UserDto | null>(null)
