'use client'

import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { format } from 'date-fns'
import { BarChart3, Calendar, CalendarIcon, Clock, Eye } from 'lucide-react'
import { useState } from 'react'

const accountTypes = [
  { value: 'personal', label: 'Personal' },
  { value: 'business', label: 'Business' },
  { value: 'joint', label: 'Joint Account' },
  { value: 'savings', label: 'Savings' },
]

const viewModes = [
  { value: 'day', label: 'Day', icon: Clock },
  { value: 'week', label: 'Week', icon: Calendar },
  { value: 'month', label: 'Month', icon: BarChart3 },
  { value: 'year', label: 'Year', icon: Eye },
  { value: 'all', label: 'All Time', icon: BarChart3 },
  { value: 'interval', label: 'Custom Interval', icon: Calendar },
]

export default function LeftSidebar() {
  const [accountType, setAccountType] = useState('personal')
  const [activeView, setActiveView] = useState('month')
  const [date, setDate] = useState<Date>()

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-semibold px-4 py-2">Finance Tracker</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Account Type</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2">
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>View Mode</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {viewModes.map((mode) => {
                const Icon = mode.icon
                return (
                  <SidebarMenuItem key={mode.value}>
                    <SidebarMenuButton isActive={activeView === mode.value} onClick={() => setActiveView(mode.value)}>
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
                  <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
