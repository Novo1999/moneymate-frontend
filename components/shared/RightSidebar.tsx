"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  FolderTree, 
  CreditCard, 
  DollarSign, 
  Settings,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Categories",
    icon: FolderTree,
    href: "/categories",
  },
  {
    title: "Accounts",
    icon: CreditCard,
    href: "/accounts",
  },
  {
    title: "Currencies",
    icon: DollarSign,
    href: "/currencies",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

interface RightSidebarProps {
  onToggle: () => void
}

export default function RightSidebar({ onToggle }: RightSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar side="right" className="w-64">
      <SidebarContent>
        <div className="flex justify-start p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}