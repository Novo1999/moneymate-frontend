import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import { accountTypeAtom } from '@/app/stores/accountType'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
const AccountDetails = () => {
  const accountTypeId = useAtomValue(accountTypeAtom)

  const { data } = useQuery({
    queryKey: ['accountType', accountTypeId],
    queryFn: async () => await AccountTypeApiService.getUserAccountType(accountTypeId || 0),
    enabled: !!accountTypeId,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Account Details</CardTitle>
        <CardDescription>View and manage account information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account ID:</span>
            <span className="font-medium">{data?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account Name:</span>
            <span className="font-medium">{data?.name}</span>
          </div>
          {data?.type && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium capitalize">{data?.type}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
export default AccountDetails
