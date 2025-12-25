'use client'

import { useIs2xl } from '@/app/hooks/use-mobile'
import LeftSidebar from '@/components/shared/LeftSidebar'
import RightSidebar from '@/components/shared/RightSidebar'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { atom, useAtom } from 'jotai'
import { PanelLeft } from 'lucide-react'
import { useEffect } from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const rightSidebarOpenAtom = atom<boolean>(false)

function DashboardContent({ children }: DashboardLayoutProps) {
  const [rightSidebarOpen, setRightSidebarOpen] = useAtom(rightSidebarOpenAtom)
  const { open, setOpen } = useSidebar()

  const is2xl = useIs2xl()

  useEffect(() => {
    if (is2xl) setRightSidebarOpen(true)
    else setRightSidebarOpen(false)
  }, [is2xl])

  return (
    <>
      <LeftSidebar />
      <SidebarInset className="flex flex-col h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="h-8 w-8">
            <PanelLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" onClick={() => setRightSidebarOpen(!rightSidebarOpen)} className="h-8 w-8">
            <PanelLeft className="h-4 w-4" />
          </Button>
        </header>
        <div className="flex flex-1 min-h-0 relative">
          <main className="flex-1 overflow-y-auto p-4">{children}</main>
          <aside
            className={`border-l overflow-y-auto transition-all duration-300 ease-in-out ${
              rightSidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'
            }`}
          >
            <div className={`${rightSidebarOpen ? 'block' : 'hidden'}`}>
              <RightSidebar />
            </div>
          </aside>
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
