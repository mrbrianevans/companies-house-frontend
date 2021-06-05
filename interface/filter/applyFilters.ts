
import { IFilter } from '../../types/IFilters'
import { FilterCategory } from '../../types/FilterCategory'
import { Timer } from '../../helpers/Timer'
import combineQueries from './combineQueries'
import { prettyPrintSqlQuery } from '../../helpers/prettyPrintSqlQuery'
import { getDatabasePool } from '../../helpers/connectToDatabase'

type Params = {
  filters: IFilter[]
  category: FilterCategory
  limit: number
  sort?: string[]
}
type AppliedFilters<FilterCategoryType> = {
  query: string,
  results: FilterCategoryType[]
}
/**
 * takes a list of filters, converts them to queries using combineQueries,
 * queries the database,
 * and returns a result list with a pretty printed query
 * */
const applyFilters: <FilterCategoryType>(params: Params) => Promise<AppliedFilters<FilterCategoryType>> =
  async ({ filters, category, limit, sort }) => {
  const timer = new Timer({label: 'Apply filters'})
  // todo: add filter id to the log
  const {query, value} = combineQueries({ filters, category })
  const prettyPrintedQuery = prettyPrintSqlQuery(query, value)
  const pool = await getDatabasePool()
  // add the limit to the end of the query
  const limitedQuery = query + ' LIMIT $' + (value.length + 1)
  value.push(Number(limit))
  const { rows: matches } = await pool.query(limitedQuery, value)
  await pool.end()
  timer.flush()
  return { query: prettyPrintedQuery, results: matches }
}

export default applyFilters
