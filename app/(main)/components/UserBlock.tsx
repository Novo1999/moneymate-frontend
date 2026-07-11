'use client'
import { useAuth } from '@/app/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { uploadImageToImgbb } from '@/lib/imgbb'
import { Camera, Loader } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

const UserBlock = () => {
  const { user, logout, isLoading, isAuthInitialized, updateUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !user?.id) return

    setIsUploadingAvatar(true)
    try {
      const avatarUrl = await uploadImageToImgbb(file)
      updateUser.mutate({ id: user.id, avatarUrl })
      toast.success('Profile picture updated')
    } catch (e) {
      console.error('Avatar upload failed', e)
      toast.error('Could not upload profile picture')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  if (!isAuthInitialized) {
    return <Skeleton className="bg-white/80 backdrop-blur-sm h-32 shadow-sm w-full" />
  }

  return (
    <Card className="custom-card w-full">
      <CardContent className="p-6 flex justify-between items-center flex-wrap">
        {isLoading ? (
          <Loader className="text-primary animate-spin" />
        ) : (
          <>
            <div className="flex items-center gap-4 flex-wrap">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                title="Change profile picture"
                className="group relative w-12 h-12 rounded-xl overflow-hidden bg-primary flex items-center justify-center cursor-pointer"
              >
                {user?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt={user?.name ?? 'Profile picture'} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-md font-bold text-white">{user?.currency}</span>
                )}
                <span
                  className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity ${isUploadingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                >
                  {isUploadingAvatar ? <Loader className="w-4 h-4 text-white animate-spin" /> : <Camera className="w-4 h-4 text-white" />}
                </span>
              </button>
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
