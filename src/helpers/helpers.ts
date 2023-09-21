import { DateTime } from 'luxon'

interface DateObject {
  hours?: number
  minutes?: number
}

/**
 * @remarks calculates the delta between now and specified unix epoch
 *
 * @returns number: seconds till provided date time
 */
export const deltaToTime = (epoch: number): number => epoch - DateTime.now().toLocal().toUnixInteger()

/**
 * @remarks calculates the delta between now and specified unix epoch
 *
 * @returns number: milliseconds till provided dateTime
 */
export const deltaToTimeMsec = (epoch: number): number => (epoch - DateTime.now().toLocal().toUnixInteger()) * 1000

/**
 * @remarks Turns Date string to epoch
 *
 * @returns number: epoch time
 */
export const dateToEpoch = (dateString: string): number => {
  return DateTime.fromJSDate(new Date(dateString)).toLocal().toUnixInteger()
}

/**
 * @remarks calculates the unix epoch hours/minutes past midnight
 *
 * @returns number: the unix epoch time for specified time past midnight
 */
export const epochPastmidnight = (
  obj: DateObject
): number => DateTime.now().endOf('day').plus(obj).toUnixInteger()

/**
 * @remarks gets the current local epoch
 *
 * @returns number: the current local epoch
 */
export const getCurrentEpoch = (): number => DateTime.now().toLocal().toUnixInteger()
