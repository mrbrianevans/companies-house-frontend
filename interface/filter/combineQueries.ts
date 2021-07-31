import { IFilterValue } from '../../types/IFilters'
import { IMinorQuery } from '../../types/IQueries'
import { FilterCategory } from '../../types/FilterCategory'
import getFilterConfig from '../../helpers/getFilterConfig'
import { Timer } from '../../helpers/Timer'
import { prettyPrintSqlQuery } from '../../helpers/prettyPrintSqlQuery'
import { validateFilter } from '../../helpers/filters/validateFilter'
import { getFilterOptionForFilterValue } from '../../helpers/filters/getFilterOptionForFilterValue'
import { getFilterComparisonProperties } from '../../helpers/filters/getFilterComparisonProperties'
import { FilterComparison, FilterComparisonsMap } from '../../configuration/filterComparisons'
type Params = {
  filters: IFilterValue[]
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
  const filterConfig = getFilterConfig({ category })
  // ATTEMPT AT NEW METHOD:
  const newValue: any[] = []
  const newQuery = `
  SELECT * FROM ${filterConfig.main_table}
    WHERE ${filters
      .filter((filter) => validateFilter(filter))
      .map((filter) => {
        const filterOption = getFilterOptionForFilterValue({ filterValue: filter, category })
        const comparator = getFilterComparisonProperties(filter.comparison).sqlOperator
        switch (filter.comparison) {
          case FilterComparison.IS_BETWEEN:
            return `${filterOption.columnName} ${comparator} $${newValue.push(filter.values[0])} AND $${newValue.push(
              filter.values[1]
            )}`
          case FilterComparison.MATCHES:
            return `${filterOption.columnName} ${comparator} ANY($${newValue.push(filter.values.map((v) => `%${v}%`))})`
          case FilterComparison.AFTER:
          case FilterComparison.BEFORE:
          case FilterComparison.GREATER_THAN:
          case FilterComparison.LESS_THAN:
            return `${filterOption.columnName} ${comparator} $${newValue.push(filter.values[0])}`
        }
      })
      .join('\n      AND ')}
  `
  console.log('Attempted new query:', prettyPrintSqlQuery(newQuery, newValue))

  throw Error('NotYetImplemented')
  return { query: 'bigQuery', value: ['bigValue'] }
}

export default combineQueries
