import AuthApiService from '@/app/ApiService/AuthApiService'
import UserApiService from '@/app/ApiService/UserApiService'
import { UserDto } from '@/app/dto/UserDto'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const authKeys = {
  currentUser: ['currentUser'] as const,
}
const ignoredPaths = ['/login', '/signup']

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthInitialized, setIsAuthInitialized] = useState(false)
  const userQuery = useQuery({
    queryKey: authKeys.currentUser,
    queryFn: async () => {
      return (await UserApiService.getCurrentUser()) || null
    },
    retry: 3,
    staleTime: 5 * 60 * 1000,
    enabled: !ignoredPaths.includes(pathname),
  })

  useEffect(() => {
    setIsAuthInitialized(true)
  }, [])

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const data = await AuthApiService.login(email, password)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser })
      router.push('/')
    },
    onError: (error: any) => {
      return error
    },
  })

  const registerMutation = useMutation({
    mutationFn: async ({ name, email, password, currency }: { name: string; email: string; password: string; currency: string }) => {
      const data = await AuthApiService.register(name, email, password, currency)
      return data
    },
    onSuccess: () => {
      toast.success('Account created successfully!')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.msg || 'Registration failed')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => await AuthApiService.logout(),
    onSuccess: () => {
      queryClient.clear()
      router.push('/login')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.msg || 'Logout failed')
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: async (partial: Partial<UserDto>) => {
      if (!partial.id) return
      const res = await UserApiService.editUser(partial.id, partial)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser })
    },
    onError: () => {
      toast.error('Update failed')
    },
  })

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,

    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,

    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,

    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,

    updateUser: updateUserMutation.mutate,
    updateUserAsync: updateUserMutation.mutateAsync,
    isUpdating: updateUserMutation.isPending,

    refetch: userQuery.refetch,
    isAuthInitialized,
  }
}
