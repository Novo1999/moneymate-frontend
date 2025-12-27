'use client'
import { editFormAtom, editOpenAtom } from '@/app/(main)/accounts/components/store'
import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import { userAtom } from '@/app/contexts/AuthContext'
import { accountTypeAtom } from '@/app/stores/accountType'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'
import { Pencil, Trash2, Wallet } from 'lucide-react'

const CurrentAccount = () => {
  const accountTypeId = useAtomValue(accountTypeAtom)
  const [, setIsEditOpen] = useAtom(editOpenAtom)
  const [, setEditForm] = useAtom(editFormAtom)
  const queryClient = useQueryClient()
  const user = useAtomValue(userAtom)

  const { data } = useQuery({
    queryKey: ['accountType', accountTypeId],
    queryFn: async () => await AccountTypeApiService.getUserAccountType(accountTypeId || 0),
    enabled: !!accountTypeId,
  })

  const handleEdit = () => {
    setEditForm({
      name: data?.name || '',
    })
    setIsEditOpen(true)
  }

  const deleteMutation = useMutation({
    mutationFn: () => AccountTypeApiService.deleteUserAccountType(accountTypeId || 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountTypes'] })
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{data?.name}</h1>
          <p className="text-muted-foreground">Manage your account details and balance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleEdit} variant="outline" size="sm">
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone. This will permanently delete your account type and remove all associated data.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Current Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {user?.currency}
            {" "}
            {parseFloat(data?.balance || '0').toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default CurrentAccount
