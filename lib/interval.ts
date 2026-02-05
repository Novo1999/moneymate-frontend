import { ActiveViewModes } from '@/types/activeViewMode';
import { addDays, endOfDay, endOfMonth, endOfYear, startOfDay, startOfMonth, startOfYear, subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';

export const getDateIntervalBasedOnActiveViewMode = (activeView: ActiveViewModes, intervalDate: Date, customRange?: DateRange): { from: string; to: string } => {
  switch (activeView) {
    case 'today': {
      const now = new Date()
      return {
        from: startOfDay(now).toISOString(),
        to: endOfDay(now).toISOString(),
      }
    }

    case 'day':
      return {
        from: subDays(intervalDate, 1).toISOString(),
        to: intervalDate.toISOString(),
      }
    case 'week':
      return {
        from: subDays(intervalDate, 7).toISOString(),
        to: intervalDate.toISOString(),
      }
    case 'month':
      return {
        from: startOfMonth(intervalDate).toISOString(),
        to: endOfMonth(intervalDate).toISOString(),
      }
    case 'year':
      return {
        from: startOfYear(intervalDate).toISOString(),
        to: endOfYear(intervalDate).toISOString(),
      }
    case 'all':
      return {
        from: new Date('1970-01-01').toISOString(),
        to: new Date().toISOString(),
      }
    case 'custom':
      if (customRange?.from && customRange?.to) {
        return {
          from: customRange.from.toISOString(),
          to: customRange.to.toISOString(),
        }
      }
      // Fallback if custom range not fully selected
      return {
        from: new Date().toISOString(),
        to: addDays(new Date(), 1).toISOString(),
      }
    default:
      return {
        from: new Date().toISOString(),
        to: addDays(new Date(), 1).toISOString(),
      }
  }
}
