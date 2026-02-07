'use client'

import { rightSidebarOpenAtom } from '@/app/layout/store'
import { NAVIGATION_ITEMS } from '@/app/utils/constants'
import { cn } from '@/lib/utils'
import { useSetAtom } from 'jotai'
import { usePathname, useRouter } from 'next/navigation'

export default function RightSidebar({ className }: { className?: string }) {
  const setRightSidebarOpen = useSetAtom(rightSidebarOpenAtom)
  const pathname = usePathname()
  const router = useRouter()

  const handleClickNavigation = async (item: (typeof NAVIGATION_ITEMS)[number]) => {
    if (item.title === 'Transactions') {
      if (pathname === '/') {
        const element = document.getElementById('transactions')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } else {
        router.push('/')
        setTimeout(() => {
          const element = document.getElementById('transactions')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        }, 300)
      }
    } else {
      router.push(item.href)
      setRightSidebarOpen(false)
    }
  }

  return (
    <div className={cn('w-64 h-full border-l right-0 2xl:right- absolute bg-background flex flex-col', className)}>
      <div className="flex-1 p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-muted-foreground px-2 mb-2">Navigation</h3>

          <nav className="space-y-1">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon
              // Mark Transactions as active when on home page
              const isActive = item.title === 'Transactions' ? pathname === '/' : pathname === item.href

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => handleClickNavigation(item)}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors text-left',
                    isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
