import LoginForm from '@/app/(auth)/login/components/LoginForm'
import Brand from '@/components/shared/Brand'
import { Card, CardContent } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-10">
          <div className="text-center mb-10">
            <Brand link='/login' />
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
