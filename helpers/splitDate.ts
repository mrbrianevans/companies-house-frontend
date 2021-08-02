const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
/**
 * Takes a timestamp in milliseconds and returns an object of {day, month, year}.
 * Months are given in full english words such as January, February etc.
 * To get MMM use month.slice(0,3) for Jan, Feb, Mar, Apr etc
 * @param timestamp milliseconds since epoch
 */
export const splitDate = (timestamp: number) => {
  const monthIndex = new Date(timestamp).getUTCMonth()
  const month = months[monthIndex]
  const year = new Date(timestamp).getUTCFullYear()
  const day = new Date(timestamp).getUTCDate()
  return { day, month, year }
}

/**
 * Takes a timestamp in milliseconds and returns a string in the format
 * YYYY-MM-DD such as 2021-07-19
 *
 * @param timestamp milliseconds since epoch
 */
export const getYMD = (timestamp: number) => {
  const month = (new Date(timestamp).getUTCMonth() + 1).toString().padStart(2, '0')
  const year = new Date(timestamp).getUTCFullYear()
  const day = new Date(timestamp).getUTCDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}
