// authActions.ts
import AuthApiService from '@/app/ApiService/AuthApiService'
import UserApiService from '@/app/ApiService/UserApiService'
import { UserDto } from '@/app/dto/UserDto'
import { userAtom } from '@/app/stores/auth'
import { atom } from 'jotai'
export const initAuthAtom = atom(null, async (_get, set) => {
  try {
    const res = await UserApiService.getCurrentUser()

    if (res?.data) {
      set(userAtom, res.data)
    } else {
      set(userAtom, null)
    }
  } catch {
    set(userAtom, null)
  }
})
export const loginAtom = atom(null, async (_get, set, { email, password }: { email: string; password: string }) => {
  const data = (await AuthApiService.login(email, password)) ?? {}
  if (!data) return

  set(userAtom, data)
  return data
})

export const logoutAtom = atom(null, async (_get, set) => {
  const res = await AuthApiService.logout()
  console.log('🚀 ~ res:', res)
  if (res.status !== 200) return
  set(userAtom, null)
  return true
})

export const updateUserAtom = atom(null, (_get, set, partial: Partial<UserDto>) => {
  set(userAtom, (prev) => (prev ? { ...prev, ...partial } : prev))
})
