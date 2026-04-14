'use client'
import { useAuth } from '@/app/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader } from 'lucide-react'

const UserBlock = () => {
  const { user, logout, isLoading, isAuthInitialized } = useAuth()

  if (!isAuthInitialized) {
    return <Skeleton className="bg-white/80 backdrop-blur-sm h-32 shadow-sm w-full" />
  }

  return (
    <Card className="saas-card w-full">
      <CardContent className="p-6 flex justify-between items-center flex-wrap">
        {isLoading ? (
          <Loader className="text-primary animate-spin" />
        ) : (
          <>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-md font-bold text-white">{user?.currency}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary">MoneyMate</h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back, <span className="font-bold">{user?.name}</span>
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => logout()} className="text-destructive hover:bg-destructive/10">
              Logout
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default UserBlock
