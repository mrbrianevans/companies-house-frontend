import { getDatabasePool } from '../../helpers/connectToDatabase'
import { ISavedFilter } from '../../types/ISavedFilter'
import { FilterCategory } from '../../types/FilterCategory'
import getFilterConfig from '../../helpers/getFilterConfig'
import { serialiseResultDates } from '../../helpers/serialiseResultDates'
import { Timer } from '../../helpers/Timer'

interface getCachedFilterWithResultsParams {
  cachedFilterId: string
  category: FilterCategory
}
interface getCachedFilterWithResultsOutput {}
/**
 * returns the results and some metadata about a previously cached filter
 * if the results have not been cached, it caches them before returning
 */
async function getCachedFilterWithResults<FilterResultsType>({
  cachedFilterId
}: getCachedFilterWithResultsParams): Promise<ISavedFilter<FilterResultsType> | null> {
  const timer = new Timer({
    filename: '/interface/filter/getCachedFilterWithResults.ts',
    label: 'getCachedFilterWithResults() method call',
    details: { cachedFilterId }
  })
  console.log('started getCachedFilterWithResults')
  const pool = await getDatabasePool()
  // get the filter metadata
  const metadataQueryTimer = timer.start('Query database for cached filter metadata')
  const { rows } = await pool.query(
    `
        UPDATE cached_filters
        SET last_viewed=CURRENT_TIMESTAMP,
            view_count=view_count + 1
        WHERE id = $1
        RETURNING view_count, created, filters, last_run, time_to_run, category
    `,
    [cachedFilterId]
  )
  metadataQueryTimer.stop()
  console.log('got rows getCachedFilterWithResults', rows.length)
  if (rows.length !== 1) {
    // filter has not been cached
    return null
  }
  //join the cached filter on cached_filter_records returning the cached results
  const filterConfig = getFilterConfig({ category: rows[0].category })
  const resultsQueryTimer = timer.start('Query database for already cached results')
  const { rows: results }: { rows: FilterResultsType[] } = await pool.query(
    `
      SELECT m.*
      FROM cached_filter_results cfr 
           LEFT JOIN ${filterConfig.main_table} m ON cfr.data_fk = m.${filterConfig.uniqueIdentifier}
      WHERE cfr.filter_fk=$1;
  `,
    [cachedFilterId]
  )
  resultsQueryTimer.stop()
  console.log('got results in getCachedFilterWithResults', results.length)
  if (results.length === 0) {
    console.log('cached filter requested with empty result set. need to query database for results before returning')
  }
  const cachedFilter: ISavedFilter<FilterResultsType> = {
    appliedFilters: rows[0].filters,
    results: serialiseResultDates(results),
    metadata: {
      id: cachedFilterId,
      lastRunTime: rows[0].time_to_run ? rows[0].time_to_run[rows[0].time_to_run.length - 1] : 0,
      lastRun: new Date(rows[0].last_run).valueOf(),
      viewCount: rows[0].view_count,
      created: new Date(rows[0].created).valueOf()
    }
  }
  timer.flush()
  return cachedFilter
}

export default getCachedFilterWithResults
