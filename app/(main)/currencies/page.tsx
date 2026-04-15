import CurrencyContainer from '@/app/(main)/currencies/components/CurrencyContainer'
import CurrencyList from '@/app/(main)/currencies/components/CurrencyList'
import SearchCurrency from '@/app/(main)/currencies/components/SearchCurrency'

export default function CurrenciesPage() {
  return (
    <CurrencyContainer>
      <SearchCurrency />
      <CurrencyList />
    </CurrencyContainer>
  )
}
