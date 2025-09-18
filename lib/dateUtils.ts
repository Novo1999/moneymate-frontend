import { isSameDay, isWithinInterval, parseISO } from 'date-fns'

const compareDate = parseISO('2025-09-14T04:41:26.145Z')

// ✅ Case 1: Single day comparison
const targetDay = new Date('2025-09-14')
isSameDay(compareDate, targetDay)

// ✅ Case 2: Date range comparison
const rangeStart = new Date('2025-09-10')
const rangeEnd = new Date('2025-09-20')

const isInRange = isWithinInterval(compareDate, {
  start: rangeStart,
  end: rangeEnd,
})
