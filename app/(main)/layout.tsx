import DashboardLayout from '@/app/layout/DashboardLayout'
import '../globals.css'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  )
}
