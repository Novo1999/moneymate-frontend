'use client'
import { searchCurrencyAtom } from '@/app/(main)/currencies/store/currencyAtoms'
import { Input } from '@/components/ui/input'
import { useAtom } from 'jotai'

const SearchCurrency = () => {
  const [search, setSearch] = useAtom(searchCurrencyAtom)

  return (
    <div className="flex items-center gap-4">
      <Input value={search} onChange={(e) => setSearch(e.target.value)} type="search" className="max-w-xs saas-input" placeholder="Search currency (e.g. USD, Euro)..." />
    </div>
  )
}
export default SearchCurrency
