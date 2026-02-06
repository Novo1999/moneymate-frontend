import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TransactionType } from '@/types/transaction'

type TabValue = TransactionType['type'] | ''

type Props = {
  value: TabValue
  onChange: (value: TabValue) => void
}

const TypeTabs = ({ value, onChange }: Props) => {
  const handleChange = (value: string) => {
    if (value === '' || value === 'income' || value === 'expense') {
      onChange(value)
    }
  }

  return (
    <Tabs value={value} onValueChange={handleChange}>
      <TabsList>
        <TabsTrigger value="">All</TabsTrigger>
        <TabsTrigger value="income">Income</TabsTrigger>
        <TabsTrigger value="expense">Expense</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default TypeTabs
