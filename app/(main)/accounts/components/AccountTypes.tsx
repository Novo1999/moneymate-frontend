'use client'

import Account from '@/app/(main)/accounts/components/Account'
import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import { useQuery } from '@tanstack/react-query'
import { Loader } from 'lucide-react'

const AccountTypes = () => {
  const { data: accountTypes, isLoading } = useQuery({
    queryKey: ['accountTypes'],
    queryFn: () => AccountTypeApiService.getUserAccountTypes(),
  })

  if (isLoading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <Loader className="animate-spin size-24 text-primary" />
      </div>
    )
  }

  return accountTypes?.map((at) => <Account key={at.id} accountType={at} />)
}
export default AccountTypes
