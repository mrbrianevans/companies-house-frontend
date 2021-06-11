import { IFilter } from '../../types/IFilters'
import { FilterCategory } from '../../types/FilterCategory'
import { Timer } from '../../helpers/Timer'
import combineQueries from './combineQueries'
import { prettyPrintSqlQuery } from '../../helpers/prettyPrintSqlQuery'
import { getDatabasePool } from '../../helpers/connectToDatabase'
import { getFilterId } from '../../helpers/getFilterId'

type Params = {
  filters: IFilter[]
  category: FilterCategory
  limit: number
  sort?: string[]
}
type AppliedFilters<FilterCategoryType> = {
  query: string
  results: FilterCategoryType[]
}
/**
 * takes a list of filters, converts them to queries using combineQueries,
 * queries the database,
 * and returns a result list with a pretty printed query
 * */
const applyFilters: <FilterCategoryType>(params: Params) => Promise<AppliedFilters<FilterCategoryType>> = async ({
  filters,
  category,
  limit,
  sort
}) => {
  const timer = new Timer({
    label: 'Apply filters',
    filename: '/interface/filter/applyFilters.ts',
    details: { category }
  })
  // add filter id to the log
  const filterId = getFilterId(filters, category)
  timer.addDetail('filterId', filterId)
  const { query, value } = combineQueries({ filters, category })
  const prettyPrintedQuery = prettyPrintSqlQuery(query, value)
  const pool = getDatabasePool()
  // add the limit to the end of the query
  const limitedQuery = query + ' LIMIT $' + (value.length + 1)
  value.push(Number(limit))
  const resultQueryTimer = timer.start('Query database for results of filters')
  const { rows: matches } = await pool.query(limitedQuery, value)
  //save in cached filters the fact that it was run and the time it took to run. not sure if this is the right place
  await pool.query(
    `UPDATE cached_filters 
    SET time_to_run = array_append(time_to_run, $1) 
    WHERE id=$2`,
    [resultQueryTimer.stop(), filterId]
  )
  await pool.end()
  timer.flush()
  return { query: prettyPrintedQuery, results: matches }
}

export default applyFilters
