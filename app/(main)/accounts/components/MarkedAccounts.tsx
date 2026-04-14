'use client'
import { markedAccountAtom } from '@/app/(main)/accounts/components/store'
import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import pluralize from '@/app/utils/pluralize'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { Check, Loader, Trash2 } from 'lucide-react'
import { MouseEvent } from 'react'

const MarkedAccounts = () => {
  const { data: accountTypes, isLoading } = useQuery({
    queryKey: ['accountTypes'],
    queryFn: () => AccountTypeApiService.getUserAccountTypes(),
  })
  const [markedAccounts, setMarkedAccount] = useAtom(markedAccountAtom)
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (accountTypeId: number) => AccountTypeApiService.deleteUserAccountType(accountTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountTypes'] })
    },
  })

  const handleMarkAndDelete = () => {
    for (const accountType of markedAccounts) {
      mutate(accountType.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['accountTypes'] })
          setMarkedAccount([])
        },
      })
    }
  }

  const allMarked = markedAccounts.length === accountTypes?.length

  const handleMarkAll = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setMarkedAccount(allMarked ? [] : accountTypes || [])
  }

  if (isLoading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center w-full">
        <Loader className="animate-spin size-24 text-primary" />
      </div>
    )
  } else
    return (
      markedAccounts.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleMarkAll} size="sm" variant="destructive">
                <Check className="w-4 h-4 mr-2" />
                {allMarked ? 'Unmark' : 'Mark'} All
              </Button>
              <Button size="sm" variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete {markedAccounts.length} Account {pluralize('Type', markedAccounts.length)}
              </Button>
            </div>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {markedAccounts.length} account types?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone. All selected account types and their associated data will be permanently removed.</AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleMarkAndDelete} disabled={isPending}>
                {isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    )
}
export default MarkedAccounts
