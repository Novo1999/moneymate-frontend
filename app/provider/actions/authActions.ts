// authActions.ts
import AuthApiService from '@/app/ApiService/AuthApiService'
import UserApiService from '@/app/ApiService/UserApiService'
import { UserDto } from '@/app/dto/UserDto'
import { authLoadingAtom, tokenAtom, userAtom } from '@/app/stores/auth'
import { atom } from 'jotai'
import Cookies from 'js-cookie'

export const initAuthAtom = atom(null, async (_get, set) => {
  const token = Cookies.get('accessToken')

  if (!token) {
    set(authLoadingAtom, false)
    return
  }

  try {
    set(tokenAtom, token)

    const payload = JSON.parse(atob(token.split('.')[1]))
    const res = await UserApiService.getUser(payload.id)

    if (res?.data) {
      set(userAtom, res.data)
    } else {
      Cookies.remove('accessToken')
      set(tokenAtom, null)
    }
  } catch {
    Cookies.remove('accessToken')
    set(tokenAtom, null)
    set(userAtom, null)
  } finally {
    set(authLoadingAtom, false)
  }
})

export const loginAtom = atom(null, async (_get, set, { email, password }: { email: string; password: string }) => {
  const token = await AuthApiService.login(email, password)

  Cookies.set('accessToken', token, {
    expires: 1,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })

  set(tokenAtom, token)

  const payload = JSON.parse(atob(token.split('.')[1]))
  set(userAtom, payload)
})

export const logoutAtom = atom(null, (_get, set) => {
  Cookies.remove('accessToken')
  set(tokenAtom, null)
  set(userAtom, null)
})

export const updateUserAtom = atom(null, (_get, set, partial: Partial<UserDto>) => {
  set(userAtom, (prev) => (prev ? { ...prev, ...partial } : prev))
})
