import { ReactNode } from 'react'

const AccountContentContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto flex justify-between">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <p className="text-muted-foreground">Manage your account details and balance</p>
      </div>
      <div className="flex gap-2 flex-wrap">{children}</div>
    </div>
  )
}
export default AccountContentContainer
