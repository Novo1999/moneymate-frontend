import { endOfMonth, startOfMonth } from 'date-fns'

const getCurrentMonthFirstAndLastDate = () => {
  const now = new Date()

  const fromDate = startOfMonth(now).toISOString()
  const toDate = endOfMonth(now).toISOString()

  return { fromDate, toDate }
}

export { getCurrentMonthFirstAndLastDate }
