import { IFilter } from '../../types/IFilters'
import { IMinorQuery } from '../../types/IQueries'
import { FilterCategory } from '../../types/FilterCategory'
import getFilterConfig from '../../helpers/getFilterConfig'
import { Timer } from '../../helpers/Timer'
import { prettyPrintSqlQuery } from '../../helpers/prettyPrintSqlQuery'
type Params = {
  filters: IFilter[]
  category: FilterCategory
}
/** combines multiple queries using either INTERSECT or EXCEPT depending on exclusion
 * takes a list of filters, returns a SQL query string to get the distinct unique identifiers
 */
const combineQueries: (params: Params) => IMinorQuery = ({ filters, category }) => {
  const timer = new Timer({ label: 'Combine queries', filename: '/interface/filter/combineQueries.ts' })
  //todo: this can be seriously improved in a big way by combining the queries more efficiently:
  // -- discoveries:
  //  -- without sic codes, it is very fast to query wide accounts combined JOIN companies JOIN detailed_postcodes
  //  -- even with sic codes, it is still faster than the current system
  //  -- queries should look something like this:
  // SELECT
  //        * FROM company_view cv
  // WHERE
  //     cv.employees BETWEEN 0 AND 11
  //   AND cv.date BETWEEN CURRENT_DATE - (50::TEXT||' years')::INTERVAL
  //     AND CURRENT_DATE - (30::TEXT||' years')::INTERVAL
  //   AND lower(cv.area) LIKE ANY ('{bristol%}')
  // ORDER BY cv.date
  // LIMIT 10;
  // which executes in 100 milliseconds

  //steps
  // 1. loop through filters, convert each to a SQL query, (function from config)
  // 2. join into single query
  const filterConfig = getFilterConfig({ category })
  // if this line every needs to be copied elsewhere, it should rather be extracted to a method
  const filterMap = new Map(filterConfig.filters.map((filter) => [filter.filterOption.category, filter.sqlGenerator]))

  // ATTEMPT AT NEW METHOD:
  // const newValue: any[] = []
  // const newQuery = `
  // SELECT * FROM ${filterConfig.main_table}
  //   WHERE ${filters
  //     .filter((filter) => filter.type === 'string')
  //     .map(
  //       (filter) =>
  //         `${filter.category} ${filter.comparison} $${
  //           //@ts-ignore
  //           newValue.push(filter.value)
  //         }`
  //     )
  //     .join('\n      AND ')}
  // `
  // console.log('Attempted new query:', prettyPrintSqlQuery(newQuery, newValue))

  const queries: string[] = []
  const values: any[] = []
  let valueCounter = 1
  for (const filter of filters) {
    if (!filterMap.has(filter.category)) {
      timer.customError('Filter not found: ' + filter.category)
      continue
    }
    if (filter.type == 'number' && filter.min > filter.max) {
      timer.customError('Minimum greater than maximum on numeric filter category: ' + filter.category)
      return { query: `SELECT * FROM ${filterConfig.main_table}`, value: [] }
    }
    //each type of filter has a function that returns a sql query
    const { query, value } = filterMap.get(filter.category)(filter)
    // updates the $1 references for the number of values
    queries.push(
      query.replace(/\?/gm, () => {
        return '$' + valueCounter++
      })
    )
    values.push(value)
  }
  if (queries.length == 0) {
    timer.customError('Zero filters to combine')
    return { query: `SELECT * FROM ${filterConfig.main_table}`, value: [] }
  }
  let bigQuery = queries.join(' INTERSECT ') // this will change to EXCEPT for excluded filters
  let bigValue = values.flat()
  return { query: bigQuery, value: bigValue }
}

export default combineQueries
