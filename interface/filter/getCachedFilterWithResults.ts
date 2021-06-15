import { getDatabasePool } from '../../helpers/connectToDatabase'
import { ICachedFilter } from '../../types/ICachedFilter'
import { FilterCategory } from '../../types/FilterCategory'
import getFilterConfig from '../../helpers/getFilterConfig'
import { serialiseResultDates } from '../../helpers/serialiseResultDates'
import { Timer } from '../../helpers/Timer'
import applyFilters from './applyFilters'
import { cacheResults } from './cacheResults'

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
}: getCachedFilterWithResultsParams): Promise<ICachedFilter<FilterResultsType> | null> {
  const timer = new Timer({
    filename: '/interface/filter/getCachedFilterWithResults.ts',
    label: 'getCachedFilterWithResults() method call',
    details: { cachedFilterId }
  })
  const pool = await getDatabasePool()
  // get the filter metadata
  const metadataQueryTimer = timer.start('Query database for cached filter metadata')
  const row = await pool.query(
    `
        UPDATE cached_filters
        SET last_viewed=CURRENT_TIMESTAMP,
            view_count=view_count + 1
        WHERE id = $1
        RETURNING view_count, created, filters, last_run, time_to_run, category, result_count
    `,
    [cachedFilterId]
  ).then(({ rows }) => rows[0])
    .catch((e) => timer.postgresError(e))
  metadataQueryTimer.stop()
  let cachedFilter: ICachedFilter<FilterResultsType>
  if (!row) {
    // filter has not been cached
    timer.customError('Cached filter is null')
    cachedFilter = null
  }else {
    const { filters, category, time_to_run, view_count, last_run, created, result_count } = row
    const { results } = await cacheResults<FilterResultsType>({ filters, category, id: cachedFilterId })
    cachedFilter = {
      appliedFilters: filters,
      results: serialiseResultDates(results),
      metadata: {
        id: cachedFilterId,
        lastRunTime: time_to_run?.slice(-1)[0] ?? 0,
        lastRun: new Date(last_run).valueOf(),
        viewCount: view_count,
        created: new Date(created).valueOf(),
        resultCount: result_count
      }
    }
  }
  timer.flush()
  return cachedFilter
}

export default getCachedFilterWithResults
