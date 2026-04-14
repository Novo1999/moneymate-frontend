'use client'

import { transactionInfoIntervalAtom } from '@/app/(main)/components/store'
import AccountTypeApiService from '@/app/ApiService/AccountTypeApiService'
import UserApiService from '@/app/ApiService/UserApiService'
import { useAuth } from '@/app/hooks/use-auth'
import { accountTypeAtom } from '@/app/stores/accountType'
import Brand from '@/components/shared/Brand'
import { activeViewAtom, dateRangeAtom } from '@/components/shared/store'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { getDateIntervalBasedOnActiveViewMode } from '@/lib/interval'
import { ActiveViewModes } from '@/types/activeViewMode'
import { useQuery } from '@tanstack/react-query'
import { format, isSameDay } from 'date-fns'
import { useAtom } from 'jotai'
import { BarChart3, Calendar, CalendarIcon, Clock, InfinityIcon, Loader, LucideIcon } from 'lucide-react'
import { useEffect, useMemo } from 'react'

import { CalendarClock, CalendarDays, CalendarRange } from 'lucide-react'

const viewModes: Array<{
  value: ActiveViewModes
  label: string
  icon: LucideIcon
}> = [
  { value: 'today', label: 'Today', icon: Clock },
  { value: 'day', label: 'Day', icon: Calendar },
  { value: 'week', label: 'Week', icon: CalendarDays },
  { value: 'month', label: 'Month', icon: CalendarRange },
  { value: 'year', label: 'Year', icon: CalendarClock },
  { value: 'all', label: 'All Time', icon: InfinityIcon },
  { value: 'custom', label: 'Custom Range', icon: BarChart3 },
]

export default function LeftSidebar() {
  const [accountTypeId, setAccountTypeId] = useAtom(accountTypeAtom)
  const [dateRange, setDateRange] = useAtom(dateRangeAtom)
  const [activeView, setActiveView] = useAtom(activeViewAtom)
  const [transactionInfoInterval, setTransactionInfoInterval] = useAtom(transactionInfoIntervalAtom)
  const transactionInfoIntervalDate = useMemo(() => new Date(transactionInfoInterval), [transactionInfoInterval])
  const { user, isLoading, updateUser } = useAuth()
  const { setOpenMobile, isMobile } = useSidebar()

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

  useEffect(() => {
    if (!user) return

    setActiveView(user?.viewMode)
    setAccountTypeId(user?.activeAccountTypeId ?? 0)

    if (user?.interval?.to) {
      setTransactionInfoInterval(user.interval.to)
    }

    if (user?.viewMode === 'custom' && user?.interval?.from && user?.interval?.to) {
      setDateRange({
        from: new Date(user.interval.from),
        to: new Date(user.interval.to),
      })
    }
  }, [user, setAccountTypeId, setActiveView, setTransactionInfoInterval, setDateRange])

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      if (!isSameDay(dateRange.from, dateRange.to)) {
        setTransactionInfoInterval(dateRange.to.toISOString())
        if (activeView !== 'custom') {
          setActiveView('custom')
          if (user?.id) {
            handleChangeActiveView('custom')
          }
        }
      }
    }
  }, [dateRange, setTransactionInfoInterval, activeView, user?.id])

  const handleChangeActiveView = async (mode: ActiveViewModes) => {
    if (!user?.id) return
    updateUser.mutate({ id: user?.id, viewMode: mode, interval: getDateIntervalBasedOnActiveViewMode(mode, transactionInfoIntervalDate, dateRange) })

    if (mode !== 'custom') {
      setDateRange(undefined)
    }
    if (!isMobile) return
    setOpenMobile(false)
  }

  const handleChangeAccountType = async (val: number) => {
    setAccountTypeId(val)
    if (user?.id) {
      await UserApiService.editUser(user?.id, { activeAccountTypeId: Number(val) })
      updateUser.mutate({ activeAccountTypeId: val })
      if (!isMobile) return
      setOpenMobile(false)
    }
  }

  const getDateRangeHelperText = () => {
    if (!dateRange?.from && !dateRange?.to) {
      return null
    }
    if (dateRange?.from && !dateRange?.to) {
      return <p className="text-xs text-muted-foreground mt-1">Please select a &ldquo;to&rdquo; date</p>
    }
    if (!dateRange?.from && dateRange?.to) {
      return <p className="text-xs text-muted-foreground mt-1">Please select a &ldquo;from&rdquo; date</p>
    }
    if (dateRange?.from && dateRange?.to && isSameDay(dateRange.from, dateRange.to)) {
      return <p className="text-xs text-destructive mt-1">From and To dates must be different</p>
    }
  }

  const renderAccountTypeSelect = () => {
    if (isLoadingAccountTypes) {
      return (
        <div>
          <Skeleton className="h-10 w-full bg-sidebar-accent" />
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
      <Loader className="animate-spin text-white" />
    ) : (
      <div>
        <Select value={accountTypeId?.toString()} onValueChange={(val) => handleChangeAccountType(Number(val))}>
          <SelectTrigger className="border-sidebar-border bg-sidebar-accent/50 text-white w-full focus:ring-sidebar-ring">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            {accountTypes?.map((type) => (
              <SelectItem
                key={type.id}
                value={type.id.toString()}
                className="text-foreground"
              >
                <div className="flex items-center gap-4">
                  <span>{type.name}</span>
                  {type.balance !== undefined && (
                    <span className="text-xs opacity-70">
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
      <SidebarHeader className="border-b border-sidebar-border pb-4">
        <Brand setOpenMobile={setOpenMobile} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 uppercase tracking-wider text-[10px] font-bold">Account Type</SidebarGroupLabel>
          <SidebarGroupContent>{renderAccountTypeSelect()}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 uppercase tracking-wider text-[10px] font-bold">View Mode</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-8 w-full bg-sidebar-accent" />)
                : viewModes.map((mode, index) => {
                    const Icon = mode.icon

                    return (
                      <SidebarMenuItem key={mode.value + index}>
                        <SidebarMenuButton
                          isActive={activeView === mode.value}
                          className="data-[active=true]:bg-sidebar-accent data-[active=true]:font-bold"
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
          <SidebarGroupLabel className="text-sidebar-foreground/60 uppercase tracking-wider text-[10px] font-bold">Custom Date Range</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal bg-sidebar-accent/50 border-sidebar-border hover:bg-sidebar-accent hover:text-white transition-colors ${!dateRange && 'text-sidebar-foreground/70'}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(dateRange.from, 'LLL dd, y')
                      )
                    ) : (
                      'Pick a date range'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                </PopoverContent>
              </Popover>
              {getDateRangeHelperText()}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
