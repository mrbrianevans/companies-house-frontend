import { IFilter } from '../../types/IFilters'
import applyFilters from './applyFilters'
import { FilterCategory } from '../../types/FilterCategory'
import { getDatabasePool } from '../../helpers/connectToDatabase'
import { Timer } from '../../helpers/Timer'
import getFilterConfig from '../../helpers/getFilterConfig'
import { prettyPrintSqlQuery } from '../../helpers/prettyPrintSqlQuery'

export type CacheResultsParams = {
  id: string
  filters: IFilter[]
  category: FilterCategory
  // how many results to cache. defaults to 20
  qty?: number
}

export interface CacheResultsOutput<FilterResultsType> {
  results: FilterResultsType[]
  // time in milliseconds to run the filter in the database. (null if results were previously cached)
  executionTime?: number
}
export async function cacheResults<FilterResultsType>({
  filters,
  category,
  id,
  qty
}: CacheResultsParams): Promise<CacheResultsOutput<FilterResultsType>> {
  const timer = new Timer({
    label: `cacheResults(id: ${id})`,
    details: { id, category, qty, method: 'cacheResults' },
    filename: '/interface/filter/cacheResults.ts'
  })
  const config = getFilterConfig({ category })
  const pool = getDatabasePool()
  const { rows: preexistingResults }: { rows: FilterResultsType[] } = await pool.query(
    `
      SELECT m.*
      FROM cached_filter_results cfr 
          -- this used to be a LEFT JOIN. taken out now. not sure why that was there
           JOIN ${config.main_table} m ON cfr.data_fk = m.${config.uniqueIdentifier}
      WHERE cfr.filter_fk=$1;
  `,
    [id]
  )
  if (preexistingResults.length === 0) {
    // this is if there are no previously cached results.
    // Could be further improved to be if the number previously cached doesn't match the limit specified
    timer.addDetail('Results already cached', false)
    const { results, executionTime } = await applyFilters<FilterResultsType>({ filters, category, limit: qty ?? 20 })

    const saveResultsToCacheTimer = timer.start('Save results to cache')
    await pool
      .query(
        `
      INSERT INTO cached_filter_results (filter_fk, data_fk)
      SELECT $1 AS filter_fk, UNNEST($2::text[]) AS data_fk
      ON CONFLICT ON CONSTRAINT unique_cached_result DO NOTHING 
  `,
        [
          id,
          results
            .map((r) => {
              if (r.hasOwnProperty(config.uniqueIdentifier)) {
                // @ts-ignore i am manually checking that the key exists
                return r[config.uniqueIdentifier]
              } else console.log(r, 'does not have column', config.uniqueIdentifier)
            })
            .filter((r) => r)
        ]
      )
      .catch((e) => timer.postgresError(e))
    saveResultsToCacheTimer.stop()
    timer.addDetail('Results qty', results.length)
    await pool.end()
    timer.flush()
    return { results, executionTime }
  } else {
    timer.addDetail('Results already cached', true)
    timer.addDetail('Results qty', preexistingResults.length)
    timer.flush()
    return { results: preexistingResults, executionTime: null }
  }
}
