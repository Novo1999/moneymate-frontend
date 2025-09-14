'use client'

import UserApiService from '@/app/ApiService/UserApiService'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Combobox } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Currency, getCurrencyDisplayName } from '@/types/currency'
import { useMutation } from '@tanstack/react-query'
import { Loader, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(Currency.USD)
  const [name, setName] = useState<string>('')
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<number>(0)
  const [firstDayOfMonth, setFirstDayOfMonth] = useState<number>(1)
  const { user, setUser } = useAuth()

  const currencyOptions = Object.values(Currency).map((currency) => ({
    value: currency,
    label: getCurrencyDisplayName(currency),
  }))

  const dayOfWeekOptions = [
    { value: '1', label: 'Sunday' },
    { value: '2', label: 'Monday' },
    { value: '3', label: 'Tuesday' },
    { value: '4', label: 'Wednesday' },
    { value: '5', label: 'Thursday' },
    { value: '6', label: 'Friday' },
    { value: '7', label: 'Saturday' },
  ]

  const dayOfMonthOptions = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  }))

  const { mutate: saveChangesMutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!user?.id) return
      const updateData = {
        name,
        currency: selectedCurrency,
        firstDayOfWeek,
        firstDayOfMonth,
      }
      await UserApiService.editUser(user?.id, updateData)
      setUser((prev) => prev && { ...prev, ...updateData })
    },
    onSuccess: () => toast.success('Changes have been saved.'),
  })

  useEffect(() => {
    if (!user) return

    setSelectedCurrency(user.currency)
    setName(user.name || '')
    setFirstDayOfWeek(user.firstDayOfWeek || 0)
    setFirstDayOfMonth(user.firstDayOfMonth || 1)
  }, [user])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="max-w-md"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Currency Settings</CardTitle>
            <CardDescription>Choose your preferred currency for displaying financial data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency-select">Default Currency</Label>
              <Combobox
                options={currencyOptions}
                value={selectedCurrency}
                onValueChange={(value) => setSelectedCurrency(value as Currency)}
                placeholder="Select a currency..."
                searchPlaceholder="Search currencies..."
                emptyMessage="No currency found."
                className="max-w-md"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar Settings</CardTitle>
            <CardDescription>Configure your preferred calendar settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first-day-week">First Day of Week</Label>
              <Combobox
                options={dayOfWeekOptions}
                value={firstDayOfWeek.toString()}
                onValueChange={(value) => setFirstDayOfWeek(Number(value))}
                placeholder="Select first day of week..."
                searchPlaceholder="Search days..."
                emptyMessage="No day found."
                className="max-w-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="first-day-month">First Day of Month</Label>
              <Combobox
                options={dayOfMonthOptions}
                value={firstDayOfMonth.toString()}
                onValueChange={(value) => setFirstDayOfMonth(Number(value))}
                placeholder="Select first day of month..."
                searchPlaceholder="Search days..."
                emptyMessage="No day found."
                className="max-w-md"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={() => saveChangesMutate()} disabled={isPending}>
        {isPending ? <Loader className="animate-spin mr-2 h-4 w-4" /> : null}
        {isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  )
}
