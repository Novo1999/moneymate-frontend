'use client'

import { useIs2xl } from '@/app/hooks/use-mobile'
import LeftSidebar from '@/components/shared/LeftSidebar'
import RightSidebar from '@/components/shared/RightSidebar'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { PanelLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

function DashboardContent({ children }: DashboardLayoutProps) {
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  const { open, setOpen } = useSidebar()

  const is2xl = useIs2xl()

  useEffect(() => {
    if (is2xl) setRightSidebarOpen(true)
    else setRightSidebarOpen(false)
  }, [is2xl])

  return (
    <>
      <LeftSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b px-4 justify-between">
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="h-8 w-8">
            <PanelLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" onClick={() => setRightSidebarOpen(!rightSidebarOpen)} className="h-8 w-8">
            <PanelLeft className="h-4 w-4" />
          </Button>
        </header>
        <div className="flex flex-1">
          <main className="flex-1 overflow-auto p-4">{children}</main>
          {rightSidebarOpen && <RightSidebar />}
        </div>
      </SidebarInset>
    </>
  )
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}
