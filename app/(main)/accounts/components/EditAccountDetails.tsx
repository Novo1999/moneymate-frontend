import { editFormAtom, editOpenAtom } from '@/app/(main)/accounts/components/store'
import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import { EditAccountDetailsDto } from '@/app/dto/EditAccountDetailsDto'
import { accountTypeAtom } from '@/app/stores/accountType'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom, useAtomValue } from 'jotai'

const EditAccountDetails = () => {
  const [isEditOpen, setIsEditOpen] = useAtom(editOpenAtom)
  const [editForm, setEditForm] = useAtom(editFormAtom)
  const accountTypeId = useAtomValue(accountTypeAtom)
  const queryClient = useQueryClient()

  const editMutation = useMutation({
    mutationFn: (editData: EditAccountDetailsDto) => AccountTypeApiService.editUserAccountType(accountTypeId || 0, editData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountType', accountTypeId] })
      queryClient.invalidateQueries({ queryKey: ['accountTypes'] })
      setIsEditOpen(false)
    },
  })

  const handleEditSubmit = () => {
    editMutation.mutate(editForm)
  }

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Account Type</DialogTitle>
          <DialogDescription>Make changes to your account type here</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Account Name</Label>
            <Input id="name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsEditOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleEditSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default EditAccountDetails
