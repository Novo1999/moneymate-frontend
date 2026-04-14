'use client'

import Account from '@/app/(main)/accounts/components/Account'
import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import { useQuery } from '@tanstack/react-query'

const AccountTypes = () => {
  const { data: accountTypes, isLoading } = useQuery({
    queryKey: ['accountTypes'],
    queryFn: () => AccountTypeApiService.getUserAccountTypes(),
  })

  return accountTypes?.map((at) => <Account key={at.id} accountType={at} />)
}
export default AccountTypes
