'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Combobox } from '@/components/ui/combobox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useFormContext } from 'react-hook-form'
import { SettingsValues } from '@/app/zod/settings.schema'

export function CalendarSettingsSection() {
  const { control } = useFormContext<SettingsValues>()

  const dayOfWeekOptions = [
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' },
  ]

  const dayOfMonthOptions = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar Settings</CardTitle>
        <CardDescription>Configure your preferred calendar settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="firstDayOfWeek"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>First Day of Week</FormLabel>
              <FormControl>
                <Combobox
                  options={dayOfWeekOptions}
                  value={field.value.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                  placeholder="Select first day of week..."
                  searchPlaceholder="Search days..."
                  emptyMessage="No day found."
                  className="max-w-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="firstDayOfMonth"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>First Day of Month</FormLabel>
              <FormControl>
                <Combobox
                  options={dayOfMonthOptions}
                  value={field.value.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                  placeholder="Select first day of month..."
                  searchPlaceholder="Search days..."
                  emptyMessage="No day found."
                  className="max-w-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
