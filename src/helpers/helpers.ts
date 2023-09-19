import { DateTime } from 'luxon'
/**
 * @remarks calculates the delta to midnight from right now
 *
 * @returns number: the milliseconds to midnight
 */
export const deltaToMidnight = (): number => {
  const date = DateTime.now().toLocal().endOf('day').plus({ hours: 1 })
  return date.diffNow().toMillis()
}

/**
 * @remarks Turns UTC to local
 *
 * @returns string: datetime to 24 hours local
 */
export const utcDateToLocal = (dateString: string): string => new Date(dateString).toLocaleString('en-us', { hour12: false })
