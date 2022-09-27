import { IFilterValue } from '../../types/IFilters'
import { FilterCategory } from '../../types/FilterCategory'
import { Timer } from '../../helpers/Timer'
import combineQueries from './combineQueries'
import { prettyPrintSqlQuery } from '../../helpers/sql/prettyPrintSqlQuery'
import { getDatabasePool } from '../../helpers/sql/connectToDatabase'
import { getFilterId } from '../../helpers/filters/getFilterId'
import getFilterConfig from '../../helpers/getFilterConfig'
import { filtersAreValid } from '../../helpers/filters/validateFilter'

type Params = {
  filters: IFilterValue[]
  category: FilterCategory
  limit: number
  sort?: string[]
}
type AppliedFilters<FilterCategoryType> = {
  query: string
  results: FilterCategoryType[]
  // time in milliseconds to run the filter in the database
  executionTime: number
}
/**
 * takes a list of filters, converts them to queries using combineQueries,
 * queries the database,
 * and returns a result list with a pretty printed query
 * */
export default async function applyFilters<FilterCategoryType>({
  filters,
  category,
  limit,
  sort
}: Params): Promise<AppliedFilters<FilterCategoryType>> {
  const timer = new Timer({
    label: 'Apply filters',
    filename: '/interface/filter/applyFilters.ts',
    details: { category }
  })
  if (!filtersAreValid({ filters, category })) {
    timer.customError('Invalid filters: ' + filters.map((f) => f.field).join())
    timer.flush()
    return null
  }
  // add filter id to the log
  const filterId = getFilterId(filters, category)
  // console.log('Apply filters', filterId)
  timer.addDetail('filterId', filterId)
  const { query, value } = combineQueries({ filters, category })
  const config = getFilterConfig({ category })
  const pool = getDatabasePool()
  // add the limit to the end of the query
  const limitedQuery = query + `LIMIT $${value.push(limit)}`
  const prettyPrintedQuery = prettyPrintSqlQuery(limitedQuery, value)
  // console.log('Query in applyFilters after limiting')
  // console.log(prettyPrintedQuery)
  const resultQueryTimer = timer.start('Query database for results of filters')
  const matches = await pool
    .query(limitedQuery, value)
    .then(({ rows }) => rows)
    .catch((e) => timer.postgresErrorReturn([])(e))
  const executionTime = resultQueryTimer.stop()
  //save in cached filters the fact that it was run and the time it took to run. not sure if this is the right place
  const persistTimeToRunTimer = timer.start('Persist the time taken to run filter in cached_filters')
  await pool
    .query(
      `UPDATE cached_filters 
    SET time_to_run = array_append(COALESCE(time_to_run,ARRAY[]::int[]), $1) 
    WHERE id=$2`,
      [executionTime, filterId]
    )
    .catch((e) => timer.postgresError(e))
  persistTimeToRunTimer.stop()
  await pool.end()
  timer.flush()
  const output: AppliedFilters<FilterCategoryType> = { query: prettyPrintedQuery, results: matches, executionTime }
  return output
}
