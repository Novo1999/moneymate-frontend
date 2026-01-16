'use client'

import { useIs2xl } from '@/app/hooks/use-mobile'
import { rightSidebarOpenAtom } from '@/app/layout/store'
import LeftSidebar from '@/components/shared/LeftSidebar'
import RightSidebar from '@/components/shared/RightSidebar'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { useAtom } from 'jotai'
import { PanelLeft } from 'lucide-react'
import { useEffect } from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

function DashboardContent({ children }: DashboardLayoutProps) {
  const [rightSidebarOpen, setRightSidebarOpen] = useAtom(rightSidebarOpenAtom)
  const { open, setOpen, setOpenMobile, openMobile } = useSidebar()
  const isMobile = useIsMobile()

  const is2xl = useIs2xl()

  useEffect(() => {
    if (is2xl) setRightSidebarOpen(true)
    else setRightSidebarOpen(false)
  }, [is2xl, setRightSidebarOpen])

  const handleToggleSidebar = () => {
    if (isMobile) {
      setOpenMobile(!openMobile)
      return
    }
    setOpen(!open)
  }

  return (
    <>
      <LeftSidebar />
      <SidebarInset className="flex flex-col h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
          <Button variant="ghost" size="icon" onClick={handleToggleSidebar} className="h-8 w-8">
            <PanelLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" onClick={() => setRightSidebarOpen(!rightSidebarOpen)} className="h-8 w-8">
            <PanelLeft className="h-4 w-4" />
          </Button>
        </header>
        <div className="flex flex-1 min-h-0 relative">
          <main className="flex-1 overflow-y-auto p-4">{children}</main>

          {/* Desktop: Aside that pushes content */}
          <aside className={`hidden lg:block border-l overflow-y-auto transition-all duration-300 ease-in-out ${rightSidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'}`}>
            <div className={`${rightSidebarOpen ? 'block' : 'hidden'}`}>
              <RightSidebar />
            </div>
          </aside>

          {/* Mobile: Overlay that doesn't push content */}
          <>
            {/* Backdrop */}
            <div
              className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${rightSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={() => setRightSidebarOpen(false)}
            />
            {/* Sidebar */}
            <div
              className={`lg:hidden fixed top-0 right-0 h-full w-64 bg-background border-l z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
                rightSidebarOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <RightSidebar />
            </div>
          </>
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
