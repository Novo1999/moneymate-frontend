import { transactionInfoIntervalAtom } from '@/app/(main)/components/ExpenseOverview'
import { activeViewAtom } from '@/components/shared/LeftSidebar'
import { Button } from '@/components/ui/button'
import { addDays, format, isBefore, startOfDay, subDays } from 'date-fns'
import { useAtom, useAtomValue } from 'jotai'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'

const DateController = () => {
  const [transactionInfoInterval, setTransactionInfoInterval] = useAtom(transactionInfoIntervalAtom)
  const activeView = useAtomValue(activeViewAtom)
  const transactionInfoIntervalDate = useMemo(() => new Date(transactionInfoInterval), [transactionInfoInterval])

  const handlePrevDate = () => {
    let prevDate: Date
    switch (activeView) {
      case 'day':
        prevDate = subDays(transactionInfoIntervalDate, 1)
        break
      case 'week':
        prevDate = subDays(transactionInfoInterval, 7)
        break
      default:
        prevDate = new Date()
    }
    setTransactionInfoInterval(prevDate.toISOString())
  }

  const handleNextDate = () => {
    let nextDate: Date
    switch (activeView) {
      case 'day':
        nextDate = addDays(transactionInfoInterval, 1)
        break
      case 'week':
        nextDate = addDays(transactionInfoInterval, 7)
        break
      default:
        nextDate = new Date()
    }
    setTransactionInfoInterval(nextDate.toISOString())
  }

  const canGoForward = () => {
    switch (activeView) {
      case 'day':
        return isBefore(transactionInfoIntervalDate, startOfDay(new Date()))
      case 'week':
        return isBefore(transactionInfoIntervalDate, startOfDay(new Date()))
      default:
        return true
    }
  }

  const week = {
    from: subDays(transactionInfoIntervalDate, 7).toISOString(),
    to: transactionInfoIntervalDate.toISOString(),
  }

  const renderDateBasedOnViewMode = () => {
    switch (activeView) {
      case 'day':
        return format(transactionInfoIntervalDate, 'd MMMM')
      case 'week':
        return `${format(week.from, 'd MMMM')} - ${format(week.to, 'd MMMM')}`
    }
  }

  return (
    <div className="flex justify-center gap-4 items-center">
      <Button onClick={handlePrevDate}>
        <ChevronLeft />
      </Button>
      <p className="text-center font-bold text-green-500">{renderDateBasedOnViewMode()}</p>
      {canGoForward() && (
        <Button onClick={handleNextDate}>
          <ChevronRight />
        </Button>
      )}
    </div>
  )
}
export default DateController
