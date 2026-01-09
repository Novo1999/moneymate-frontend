import { DynamicPageForm } from '@/app/zod/auth.schema'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Currency, getCurrencyDisplayName, getCurrencyFromCountryCode } from '@/types/currency'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
const CurrencyPicker = () => {
  const [open, setOpen] = useState(false)
  const form = useFormContext<DynamicPageForm>()

  useEffect(() => {
    const detectCurrency = async () => {
      const apiKey = process.env.NEXT_PUBLIC_IP_API_KEY
      if (!apiKey) return

      try {
        const res = await fetch(`http://api.ipapi.com/check?access_key=${apiKey}&format=1`)
        const data = await res.json()
        console.log('🚀 ~ detectCurrency ~ data:', data)

        // Use getCurrencyFromCountryCode instead of getCurrencyDisplayName
        const currency = getCurrencyFromCountryCode(data?.country_code)
        console.log('🚀 ~ detectCurrency ~ currency:', currency)

        if (currency) {
          form.setValue('currency', currency)
        }
      } catch (error) {
        console.error('Failed to detect currency:', error)
      }
    }

    detectCurrency()
  }, [form])

  return (
    <FormField
      control={form.control}
      name="currency"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Currency</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant="outline" role="combobox" aria-expanded={open} className={cn('h-12 w-full justify-between', !field.value && 'text-muted-foreground')}>
                  {field.value ? getCurrencyDisplayName(field.value) : 'Select currency'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search currency..." />
                <CommandList>
                  <CommandEmpty>No currency found.</CommandEmpty>
                  <CommandGroup>
                    {Object.values(Currency).map((currency) => (
                      <CommandItem
                        key={currency}
                        value={currency}
                        onSelect={() => {
                          field.onChange(currency)
                          setOpen(false)
                        }}
                      >
                        <Check className={cn('mr-2 h-4 w-4', field.value === currency ? 'opacity-100' : 'opacity-0')} />
                        {getCurrencyDisplayName(currency)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
export default CurrencyPicker
