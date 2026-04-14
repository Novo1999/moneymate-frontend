'use client'
import { useAuth } from '@/app/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Currency, getCurrencyDisplayName } from '@/types/currency'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const CurrenciesPage = () => {
  const { user, updateUser } = useAuth()
  const [search, setSearch] = useState('')

  const currencyOptions = Object.values(Currency).map((currency) => ({
    value: currency,
    label: getCurrencyDisplayName(currency),
  }))

  const { mutate: changeCurrencyMutate, isPending } = updateUser

  const handleChangeCurrency = (selectedCurrency: Currency) => {
    if (isPending) return
    if (selectedCurrency === user?.currency) return
    if (!user?.id) return

    changeCurrencyMutate({
      id: user.id,
      currency: selectedCurrency,
    })
    if (search) setSearch('')
  }

  useEffect(() => {
    if (!isPending) {
      toast.dismiss('currency')
      return
    }
    toast.loading('Changing Currency...', { id: 'currency', position: 'top-center' })
  }, [isPending])

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto p-6 bg-card rounded-xl border shadow-sm">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Currencies</h1>
        <p className="text-muted-foreground">Select your preferred currency for the application.</p>
      </div>
      
      <div className="flex items-center gap-4">
        <Input 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          type="search" 
          className="max-w-xs saas-input" 
          placeholder="Search currency (e.g. USD, Euro)..." 
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {currencyOptions
          .filter(opt => !search || opt.label.toLowerCase().includes(search.toLowerCase()) || opt.value.toLowerCase().includes(search.toLowerCase()))
          .map((opt) => {
            const isSelected = user?.currency === opt.value
            return (
              <Button
                variant={isSelected ? "default" : "outline"}
                disabled={isPending}
                onClick={() => handleChangeCurrency(opt.value)}
                className={cn(
                  "h-12 justify-start px-4 transition-all duration-200 font-medium",
                  isSelected ? "shadow-md scale-[1.02]" : "hover:border-primary/50 hover:bg-primary/5"
                )}
                key={opt.value}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">Active</span>}
              </Button>
            )
          })}
      </div>
    </div>
  )
}
export default CurrenciesPage
