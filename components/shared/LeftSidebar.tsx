'use client'

import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import UserApiService from '@/app/ApiService/UserApiService'
import { useAuth } from '@/app/hooks/use-auth'
import { accountTypeAtom } from '@/app/stores/accountType'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { ActiveViewModes } from '@/types/activeViewMode'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { atom, useAtom } from 'jotai'
import { BarChart3, Calendar, CalendarIcon, Clock, Eye, Loader, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

const viewModes: Array<{ value: ActiveViewModes; label: string; icon: LucideIcon }> = [
  { value: 'day', label: 'Day', icon: Clock },
  { value: 'week', label: 'Week', icon: Calendar },
  { value: 'month', label: 'Month', icon: BarChart3 },
  { value: 'year', label: 'Year', icon: Eye },
  { value: 'all', label: 'All Time', icon: BarChart3 },
  { value: 'interval', label: 'Custom Interval', icon: Calendar },
]

export const activeViewAtom = atom<ActiveViewModes>('day')
export const dateAtom = atom<Date | undefined>(undefined)

export default function LeftSidebar() {
  const [accountTypeId, setAccountTypeId] = useAtom(accountTypeAtom)
  const [date, setDate] = useAtom(dateAtom)
  const [activeView, setActiveView] = useAtom(activeViewAtom)

  const { user, isLoading, updateUser } = useAuth()

  const {
    data: accountTypes,
    isLoading: isLoadingAccountTypes,
    isError: isErrorAccountTypes,
  } = useQuery({
    queryKey: ['accountTypes'],
    queryFn: AccountTypeApiService.getUserAccountTypes,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  // Set default account type when data loads
  useEffect(() => {
    if (!user) return
    setActiveView(user?.viewMode)
    setAccountTypeId(user?.activeAccountTypeId ?? 0)
  }, [user, setAccountTypeId, setActiveView])

  const handleChangeActiveView = async (mode: ActiveViewModes) => {
    if (!user?.id) return
    await UserApiService.editUser(user?.id, { viewMode: mode })
    updateUser({ viewMode: mode })
  }

  const handleChangeAccountType = async (val: number) => {
    setAccountTypeId(val)
    if (user?.id) {
      await UserApiService.editUser(user?.id, { activeAccountTypeId: Number(val) })
      updateUser({ activeAccountTypeId: val })
    }
  }

  const renderAccountTypeSelect = () => {
    if (isLoadingAccountTypes) {
      return (
        <div>
          <Skeleton className="h-10 w-full bg-custom-green" />
        </div>
      )
    }

    if (isErrorAccountTypes) {
      return (
        <div className="px-2">
          <div className="text-sm text-destructive">Failed to load account types</div>
        </div>
      )
    }

    return isLoading ? (
      <Loader className="animate-spin" />
    ) : (
      <div>
        <Select value={accountTypeId?.toString()} onValueChange={(val) => handleChangeAccountType(Number(val))}>
          <SelectTrigger className="border-green-500 w-full">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            {accountTypes?.map((type) => (
              <SelectItem key={type.id} value={type.id.toString()}>
                <div className="flex items-center gap-4">
                  <span>{type.name}</span>
                  {type.balance !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      Balance: {type.balance.toLocaleString()} {user?.currency}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={'/'} className="text-lg font-semibold py-2">
          Moneymate
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Account Type</SidebarGroupLabel>
          <SidebarGroupContent>{renderAccountTypeSelect()}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>View Mode</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-8 w-full bg-custom-green" />)
                : viewModes.map((mode) => {
                    const Icon = mode.icon

                    return (
                      <SidebarMenuItem key={mode.value}>
                        <SidebarMenuButton
                          isActive={activeView === mode.value}
                          onClick={() => {
                            setActiveView(mode.value)
                            handleChangeActiveView(mode.value)
                          }}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{mode.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Date Selection</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={`w-full justify-start text-left font-normal ${!date && 'text-muted-foreground'}`}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
              </Popover>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
