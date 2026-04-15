'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Combobox } from '@/components/ui/combobox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Currency, getCurrencyDisplayName } from '@/types/currency'
import { useFormContext } from 'react-hook-form'
import { SettingsValues } from '@/app/zod/settings.schema'

export function CurrencySettingsSection() {
  const { control } = useFormContext<SettingsValues>()

  const currencyOptions = Object.values(Currency).map((currency) => ({
    value: currency,
    label: getCurrencyDisplayName(currency),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Settings</CardTitle>
        <CardDescription>Choose your preferred currency for financial data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="currency"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Default Currency</FormLabel>
              <FormControl>
                <Combobox
                  options={currencyOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select a currency..."
                  searchPlaceholder="Search currencies..."
                  emptyMessage="No currency found."
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
