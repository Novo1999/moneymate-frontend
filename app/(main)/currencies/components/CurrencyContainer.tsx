import { ReactNode } from 'react'

const CurrencyContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto p-6 bg-card rounded-xl border shadow-sm">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Currencies</h1>
        <p className="text-muted-foreground">Select your preferred currency for the application.</p>
      </div>
      {children}
    </div>
  )
}
export default CurrencyContainer
