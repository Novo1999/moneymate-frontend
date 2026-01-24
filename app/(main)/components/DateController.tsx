import { getDateIntervalBasedOnActiveViewMode, transactionInfoIntervalAtom } from '@/app/(main)/components/ExpenseOverview'
import { useAuth } from '@/app/hooks/use-auth'
import { activeViewAtom, dateRangeAtom } from '@/components/shared/LeftSidebar'
import { Button } from '@/components/ui/button'
import { addDays, addMonths, addYears, format, isBefore, startOfDay, startOfMonth, startOfYear, subDays, subMonths, subYears } from 'date-fns'
import { useAtom, useAtomValue } from 'jotai'
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react'
import { useMemo } from 'react'

const DateController = () => {
  const [transactionInfoInterval, setTransactionInfoInterval] = useAtom(transactionInfoIntervalAtom)
  const activeView = useAtomValue(activeViewAtom)
  const dateRange = useAtomValue(dateRangeAtom)
  const transactionInfoIntervalDate = useMemo(() => new Date(transactionInfoInterval), [transactionInfoInterval])
  const { user, updateUser, isLoading } = useAuth()

  const handlePrevDate = () => {
    let prevDate: Date
    switch (activeView) {
      case 'day':
        prevDate = subDays(transactionInfoIntervalDate, 1)
        break
      case 'week':
        prevDate = subDays(transactionInfoInterval, 7)
        break
      case 'month':
        prevDate = subMonths(transactionInfoIntervalDate, 1)
        break
      case 'year':
        prevDate = subYears(transactionInfoIntervalDate, 1)
        break
      default:
        prevDate = new Date()
    }
    setTransactionInfoInterval(prevDate.toISOString())

    if (user?.id) {
      const interval = getDateIntervalBasedOnActiveViewMode(activeView, prevDate, dateRange)
      updateUser({ id: user.id, interval })
    }
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
      case 'month':
        nextDate = addMonths(transactionInfoIntervalDate, 1)
        break
      case 'year':
        nextDate = addYears(transactionInfoIntervalDate, 1)
        break
      default:
        nextDate = new Date()
    }
    setTransactionInfoInterval(nextDate.toISOString())

    if (user?.id) {
      const interval = getDateIntervalBasedOnActiveViewMode(activeView, nextDate, dateRange)
      updateUser({ id: user.id, interval })
    }
  }

  const canGoForward = () => {
    switch (activeView) {
      case 'day':
        return isBefore(transactionInfoIntervalDate, startOfDay(new Date()))
      case 'week':
        return isBefore(transactionInfoIntervalDate, startOfDay(new Date()))
      case 'month':
        return isBefore(transactionInfoIntervalDate, startOfMonth(new Date()))
      case 'year':
        return isBefore(transactionInfoIntervalDate, startOfYear(new Date()))
      case 'all':
      case 'custom':
        return false
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
      case 'month':
        return format(transactionInfoIntervalDate, 'MMMM yyyy')
      case 'year':
        return format(transactionInfoIntervalDate, 'yyyy')
      case 'all':
        return 'All Time'
      case 'custom':
        if (dateRange?.from && dateRange?.to) {
          return `${format(dateRange.from, 'd MMM yyyy')} - ${format(dateRange.to, 'd MMM yyyy')}`
        }
        return 'Select a date range'
      default:
        return ''
    }
  }

  if (activeView === 'all' || activeView === 'custom') {
    return (
      <div className="flex justify-center gap-4 items-center">
        <p className="text-center font-bold text-green-500">{renderDateBasedOnViewMode()}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[20vh]">
        <Loader className="animate-spin text-green-500" />
      </div>
    )
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
