'use client'

import { rightSidebarOpenAtom } from '@/app/layout/store'
import { cn } from '@/lib/utils'
import { useAtom } from 'jotai'
import { CreditCard, DollarSign, FolderTree, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigationItems = [
  {
    title: 'Categories',
    icon: FolderTree,
    href: '/categories',
  },
  {
    title: 'Accounts',
    icon: CreditCard,
    href: '/accounts',
  },
  {
    title: 'Currencies',
    icon: DollarSign,
    href: '/currencies',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
  },
]

interface RightSidebarProps {
  className?: string
}

export default function RightSidebar({ className }: RightSidebarProps) {
  const [_, setRightSidebarOpen] = useAtom(rightSidebarOpenAtom)

  const pathname = usePathname()

  return (
    <div className={cn('w-64 h-full border-l right-0 2xl:right- absolute bg-background flex flex-col', className)}>
      <div className="flex-1 p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-muted-foreground px-2 mb-2">Navigation</h3>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  onClick={() => setRightSidebarOpen(false)}
                  key={item.title}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
