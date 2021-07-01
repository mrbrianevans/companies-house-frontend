// this file is located in: /interface/filter/cacheFilter.ts
// to import from this file, use: import { CacheFilterParams, CacheFilterOutput, cacheFilter } from '../../interface/filter/cacheFilter'

import { IFilter } from '../../types/IFilters'
import { FilterCategory } from '../../types/FilterCategory'
import { getDatabasePool } from '../../helpers/connectToDatabase'
import { getFilterId } from '../../helpers/getFilterId'
import { Timer } from '../../helpers/Timer'
import getFilterConfig from '../../helpers/getFilterConfig'
import applyFilters from './applyFilters'
import { logPostgresError } from '../../helpers/loggers/PostgresErrorLogger'
import combineQueries from './combineQueries'
import { prettyPrintSqlQuery } from '../../helpers/prettyPrintSqlQuery'
import { cacheResults } from './cacheResults'

// input parameters for cacheFilter
export interface CacheFilterParams {
  filters: IFilter[]
  category: FilterCategory
}

// return type of cacheFilter
export interface CacheFilterOutput {
  id: string
}

/**
 * cacheFilter interface method
 *
 * @example await cacheFilter({filters, category})
 * @param  CacheFilterParams filters, category
 * @returns  CacheFilterOutput
 */
export async function cacheFilter<FilterCategoryType>({
  filters,
  category
}: CacheFilterParams): Promise<CacheFilterOutput | null> {
  const timer = new Timer({ label: 'Call cacheFilter method', filename: 'interface/filter/cacheFilter.ts' })
  const pool = getDatabasePool()
  const id = getFilterId(filters, category)
  const client = await pool.connect()
  timer.start('Apply filters - Query database for results to cache')
  // only saves the top 20 results in the database
  const { query, value } = combineQueries({ filters, category })
  const prettyPrintedQuery = prettyPrintSqlQuery(query, value)
  const timeToRun: number = timer.end()

  await client
    .query(
      `
    INSERT INTO cached_filters
    (id, category, filters, time_to_run, last_run, query)
    VALUES 
    ($1, $2, $3, ARRAY[$4::int], CURRENT_TIMESTAMP, $5)
    ON CONFLICT ON CONSTRAINT cached_filters_id_pk DO UPDATE SET
    last_run=CURRENT_TIMESTAMP, 
    time_to_run = array_append(cached_filters.time_to_run, $4::int),
    query=excluded.query
    `,
      [id, category, filters, timeToRun, prettyPrintedQuery]
    )
    .catch((e) => timer.postgresError(e))
  await client.release()
  await pool.end()
  await cacheResults({ filters, category, id })
  timer.flush()
  return { id }
}
