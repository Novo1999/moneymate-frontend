import { AuthFormProvider } from '@/app/provider/form/AuthFormProvider'

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AuthFormProvider>{children}</AuthFormProvider>
}
