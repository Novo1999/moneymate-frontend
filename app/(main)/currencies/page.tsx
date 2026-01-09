'use client'
import UserApiService from '@/app/ApiService/UserApiService'
import { userAtom } from '@/app/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Currency, getCurrencyDisplayName } from '@/types/currency'
import { useMutation } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const CurrenciesPage = () => {
  const [user, setUser] = useAtom(userAtom)
  const [search, setSearch] = useState('')

  const currencyOptions = Object.values(Currency).map((currency) => ({
    value: currency,
    label: getCurrencyDisplayName(currency),
  }))

  const { mutate: changeCurrencyMutate, isPending } = useMutation({
    mutationFn: async (selectedCurrency: Currency) => {
      if (selectedCurrency === user?.currency) return
      if (!user?.id) return
      const updateData = {
        currency: selectedCurrency,
      }
      await UserApiService.editUser(user?.id, updateData)
      setUser((prev) => prev && { ...prev, ...updateData })
      if (search) setSearch('')
    },
  })

  useEffect(() => {
    if (!isPending) {
      toast.dismiss('currency')
      return
    }
    toast.loading('Changing Currency...', { id: 'currency', position: 'top-center', style: { background: 'oklch(72.3% 0.219 149.579)', color: '#fff' } })
  }, [isPending])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 flex-col">
        <Label className="text-2xl font-bold">Currencies</Label>
        <Label className="text-gray-400">Select your preferred currency for the app</Label>
      </div>
      <Input value={search} onChange={(e) => setSearch(e.target.value)} type="search" className="w-fit" placeholder="Search Currency" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl">
        {currencyOptions?.map((opt) => (
          <Button
            onClick={() => changeCurrencyMutate(opt.value)}
            className={cn(
              'transform transition duration-300 w-full',
              user?.currency !== opt.value ? 'bg-green-200 text-black' : 'bg-custom-green',
              search && (opt.label.toLowerCase().includes(search.toLowerCase()) || opt.value.toLowerCase().includes(search.toLowerCase())) ? 'scale-102 border-2 border-green-500' : 'scale-100'
            )}
            key={opt.value}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
export default CurrenciesPage
