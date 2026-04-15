'use client'
import { searchCurrencyAtom } from '@/app/(main)/currencies/store/currencyAtoms'
import { useAuth } from '@/app/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Currency, getCurrencyDisplayName } from '@/types/currency'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { toast } from 'sonner'

const CurrencyList = () => {
  const [search, setSearch] = useAtom(searchCurrencyAtom)
  const { user, updateUser } = useAuth()

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {currencyOptions
        .filter((opt) => !search || opt.label.toLowerCase().includes(search.toLowerCase()) || opt.value.toLowerCase().includes(search.toLowerCase()))
        .map((opt) => {
          const isSelected = user?.currency === opt.value
          return (
            <Button
              variant={isSelected ? 'default' : 'outline'}
              disabled={isPending}
              onClick={() => handleChangeCurrency(opt.value)}
              className={cn(
                'h-12 justify-start px-4 transition-all duration-200 font-medium hover:text-teal-600',
                isSelected ? 'shadow-md scale-[1.02] hover:text-white' : 'hover:border-primary/50 hover:bg-primary/5',
              )}
              key={opt.value}
            >
              <span className="truncate">{opt.label}</span>
              {isSelected && <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">Active</span>}
            </Button>
          )
        })}
    </div>
  )
}
export default CurrencyList
