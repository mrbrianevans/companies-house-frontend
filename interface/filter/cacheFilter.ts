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
export async function cacheFilter<FilterCategoryType>({ filters, category }: CacheFilterParams): Promise<CacheFilterOutput|null> {
  const timer = new Timer({ label: 'Call cacheFilter method', filename: 'interface/filter/cacheFilter.ts' })
  const pool = getDatabasePool()
  const id = getFilterId(filters, category)
  const config = getFilterConfig({ category })
  const client = await pool.connect()
  timer.start('Apply filters - Query database for results to cache')
  // only saves the top 10 results in the database
  const { query, results } = await applyFilters<FilterCategoryType>({filters, category, limit: 20})
  const timeToRun: number = timer.end()
  console.log('timeToRun:', timeToRun)
  // this is in a transaction
  try{
    await client.query('BEGIN')
    await client.query(
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
      [id, category, filters, timeToRun, query]
    )
    timer.start('Saved cache results in cached_filter_results')
    await client.query(`
      INSERT INTO cached_filter_results (filter_fk, data_fk)
      SELECT $1 AS filter_fk, UNNEST($2::text[]) AS data_fk
      ON CONFLICT ON CONSTRAINT unique_cached_result DO NOTHING 
  `, [id, results.map(r=> {
      if(r.hasOwnProperty(config.uniqueIdentifier))
      { // @ts-ignore i am manually checking that the key exists
        return r[config.uniqueIdentifier]
      }else console.log(r, 'does not have column', config.uniqueIdentifier)
    }).filter(r=>r)])
    await client.query('COMMIT')
    return { id }
  }catch (e) {
    // if it fails to save the cached filter and the cache results, then it returns null and rolls back any changes
    logPostgresError(e)
    await client.query('ROLLBACK')
    return null
  }finally {
    await client.release()
    await pool.end()
    timer.flush()
  }
}