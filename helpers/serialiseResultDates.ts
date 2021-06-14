/**
 * Mutates an array of results from a SQL query to change all the dates to timestamps.
 * This is necessary to serialise the results as JSON.
 * @param results array of rows from a SQL query
 */
export function serialiseResultDates<T>(results: T[]): T[] {
  results.forEach((result) => {
    Object.keys(result).forEach((key) => {
      // @ts-ignore trust me, sometimes it does have overlap
      if (result[key] instanceof Date) result[key] = result[key].toJSON()
    })
  })
  return results
}

/**
 * Mutates an result row from a SQL query to change all the dates to human readable dates.
 * Formats dates as YYYY-MM-DD
 * @param result_row result row from a SQL query
 */
export function readableResultDates<T>(result_row: T): T {
  Object.entries(result_row).forEach(([key, value]) => {
    if (value instanceof Date) {
      // @ts-ignore
      result_row[key] = `${value.getUTCFullYear()}-${(value.getUTCMonth() + 1)
        .toString()
        .padStart(2, '0')}-${value.getDate()}`
    }
  })
  return result_row
}
