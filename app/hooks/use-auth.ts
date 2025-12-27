import { loginAtom, logoutAtom } from '@/app/provider/actions/authActions'
import { authLoadingAtom, tokenAtom, userAtom } from '@/app/stores/auth'
import { useAtomValue, useSetAtom } from 'jotai'

export function useAuth() {
  return {
    user: useAtomValue(userAtom),
    token: useAtomValue(tokenAtom),
    isLoading: useAtomValue(authLoadingAtom),
    login: useSetAtom(loginAtom),
    logout: useSetAtom(logoutAtom),
  }
}
