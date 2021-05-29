
import { IFilter } from '../../types/IFilters'
import { IMinorQuery } from '../../types/IQueries'
import { FilterCategory } from "../../types/FilterCategory";
import getFilterConfig from '../../helpers/getFilterConfig'
type Params = {
  filters: IFilter[]
  category: FilterCategory
}
/** combines multiple queries using either INTERSECT or EXCEPT depending on exclusion
 * takes a list of filters, returns a SQL query string to get the distinct unique identifiers
 */
const combineQueries: (params: Params) => IMinorQuery = ({filters, category}) => {
  //steps
  // 1. loop through filters, convert each to a SQL query, (function from config)
  // 2. join into single query
  const filterConfig = getFilterConfig({ category })
  // if this line every needs to be copied elsewhere, it should rather be extracted to a method
  const filterMap = new Map(filterConfig.filters.map(filter=>[filter.filterOption.category, filter.sqlGenerator]))
  const queries: string[] = []
  const values: any[] = []
  let valueCounter = 1
  for (const filter of filters) {
    if (!filterMap.has(filter.category)) {
      //todo: replace with error logger helper method
      console.log('Filter not found:', filter.category, filter)
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
    return { query: 'SELECT number FROM companies LIMIT 1', value: [] }
  }
  let bigQuery = queries.join(' INTERSECT ') // this will change to EXCEPT for excluded filters
  let bigValue = values.flat()
  return {query: bigQuery, value: bigValue}
}

export default combineQueries