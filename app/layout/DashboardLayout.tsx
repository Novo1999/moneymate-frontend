import DashboardContent from '@/app/(main)/components/Dashboard'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}
