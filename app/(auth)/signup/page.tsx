import { SignUpForm } from '@/app/(auth)/signup/components/SignUpForm'
import Brand from '@/components/shared/Brand'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-10">
          <div className="text-center mb-10">
            <Brand className='h-24 w-40 mx-auto' link="/signup" />
            <p className="text-muted-foreground">Create your account</p>
          </div>

          <SignUpForm />

          <div className="mt-6 text-center flex justify-center items-center">
            <p className="text-sm text-muted-foreground">Already have an account?</p>
            <Button variant="link" className="p-1">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
