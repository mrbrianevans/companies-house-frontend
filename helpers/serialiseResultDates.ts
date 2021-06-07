/**
 * Mutates an array of results from a SQL query to change all the dates to timestamps.
 * This is necessary to serialise the results as JSON.
 * @param results array of rows from a SQL query
 */
export function serialiseResultDates<T>(results: T[]): T[] {
  results.forEach((result) => {
    Object.keys(result).forEach((key) => {
      // @ts-ignore trust me, sometimes it does have overlap
      if (result[key] instanceof Date) result[key] = new Date(result[key]).valueOf()
    })
  })
  return results
}
