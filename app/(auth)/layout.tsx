import { AuthFormProvider } from '@/app/provider/form/AuthFormProvider'
import { getCurrencyFromCountryCode } from '@/types/currency'

const detectCurrency = async () => {
  const apiKey = process.env.NEXT_PUBLIC_IP_API_KEY
  if (!apiKey) return

  try {
    const res = await fetch(`http://api.ipapi.com/check?access_key=${apiKey}&format=1`, { next: { revalidate: 3600 } })
    const data = await res.json()

    // Use getCurrencyFromCountryCode instead of getCurrencyDisplayName
    const currency = getCurrencyFromCountryCode(data?.country_code)

    return currency
  } catch (error) {
    console.error('Failed to detect currency:', error)
  }
}

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const currency = await detectCurrency()

  return <AuthFormProvider currencyData={currency}>{children}</AuthFormProvider>
}
