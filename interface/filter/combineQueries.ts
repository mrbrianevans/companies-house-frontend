import { IFilterValue } from '../../types/IFilters'
import { IMinorQuery } from '../../types/IQueries'
import { FilterCategory } from '../../types/FilterCategory'
import getFilterConfig from '../../helpers/getFilterConfig'
import { validateFilter } from '../../helpers/filters/validateFilter'
import { sqlWhereConverter } from '../../helpers/sqlWhereConverter'
import { getFromClause } from '../../helpers/sqlFromGenerator'

type Params = {
  filters: IFilterValue[]
  category: FilterCategory
  // to override the default columns selected
  customSelect?: string
}
/** combines multiple queries using either INTERSECT or EXCEPT depending on exclusion
 * takes a list of filters, returns a SQL query string to get the distinct unique identifiers
 */
const combineQueries: (params: Params) => IMinorQuery = ({ filters, category, customSelect }) => {
  const filterConfig = getFilterConfig({ category })
  const newValue: any[] = []
  const selectClause = customSelect ?? `SELECT ${filterConfig.main_table}.*`
  const fromClause = getFromClause({ filters, category })
  const whereClause =
    ' WHERE ' +
    filters
      .filter((filter) => validateFilter(filter, category))
      .map((filter) => {
        return sqlWhereConverter({ filter, category, values: newValue })
      })
      .join('\n   AND ')
  const groupClause = ``
  const orderClause = ``
  const newQuery = [selectClause, fromClause, whereClause, groupClause, orderClause].join('\n')
  return { query: newQuery, value: newValue }
}

export default combineQueries
