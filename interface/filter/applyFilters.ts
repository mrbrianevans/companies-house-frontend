import { IFilter } from '../../types/IFilters'
import { FilterCategory } from '../../types/FilterCategory'
import { Timer } from '../../helpers/Timer'
import combineQueries from './combineQueries'
import { prettyPrintSqlQuery } from '../../helpers/prettyPrintSqlQuery'
import { getDatabasePool } from '../../helpers/connectToDatabase'
import { getFilterId } from '../../helpers/getFilterId'
import getFilterConfig from '../../helpers/getFilterConfig'

type Params = {
  filters: IFilter[]
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
  // add filter id to the log
  const filterId = getFilterId(filters, category)
  timer.addDetail('filterId', filterId)
  const { query, value } = combineQueries({ filters, category })
  const config = getFilterConfig({ category })
  const pool = getDatabasePool()
  // add the limit to the end of the query
  const limitedQuery = `
WITH results AS (${query}) 
SELECT * FROM results JOIN ${config.main_table} m 
    ON results.${config.uniqueIdentifier} = m.${config.uniqueIdentifier}
LIMIT $${value.length + 1}`
  value.push(Number(limit))
  const prettyPrintedQuery = prettyPrintSqlQuery(limitedQuery, value)
  // console.log(prettyPrintedQuery)
  const resultQueryTimer = timer.start('Query database for results of filters')
  const { rows: matches } = await pool.query(limitedQuery, value)
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
