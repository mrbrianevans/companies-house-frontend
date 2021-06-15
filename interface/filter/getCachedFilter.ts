import { getDatabasePool } from '../../helpers/connectToDatabase'
import { ICachedFilter } from '../../types/ICachedFilter'
import { FilterCategory } from '../../types/FilterCategory'
import getFilterConfig from '../../helpers/getFilterConfig'
import { serialiseResultDates } from '../../helpers/serialiseResultDates'
import { Timer } from '../../helpers/Timer'

interface GetCachedFilterParams {
  cachedFilterId: string
  category: FilterCategory
}
interface GetCachedFilterOutput {}
/**
 * returns the results and some metadata about a previously cached filter.
 * does not return the results of the filter, unless they are already cached
 */
async function getCachedFilter<FilterResultsType>({
  cachedFilterId
}: GetCachedFilterParams): Promise<ICachedFilter<FilterResultsType> | null> {
  const timer = new Timer({
    filename: '/interface/filter/getCachedFilter.ts',
    label: `getCachedFilter(${cachedFilterId}) method called`
  })
  const pool = await getDatabasePool()
  // get the filter metadata
  const row = await pool
    .query(
      `
        UPDATE cached_filters
        SET last_viewed=CURRENT_TIMESTAMP,
            view_count=view_count + 1
        WHERE id = $1
        RETURNING view_count, created, filters, last_run, time_to_run, category, result_count
    `,
      [cachedFilterId]
    )
    .then(({ rows }) => rows[0])
    .catch((e) => timer.postgresError(e))

  let cachedFilter: ICachedFilter<FilterResultsType>
  if (!row) {
    // filter has not been cached
    timer.customError('Cached filter is null')
    cachedFilter = null
  } else {
    // this section basically adds in previously cached results to the returned cacheFilter. Currently disabled
    // this is slowing down page loads too much. re-enable when the combineQueries function has been improved
    // //join the cached filter on cached_filter_records returning the cached results
    // const filterConfig = getFilterConfig({ category: rows[0].category })
    // const { rows: results }: { rows: FilterResultsType[] } = await pool.query(
    //   `
    //     SELECT m.*
    //     FROM cached_filter_results cfr
    //          LEFT JOIN ${filterConfig.main_table} m ON cfr.data_fk = m.${filterConfig.uniqueIdentifier}
    //     WHERE cfr.filter_fk=$1;
    // `,
    //   [cachedFilterId]
    // )
    cachedFilter = {
      appliedFilters: row.filters,
      // results: results.length ? serialiseResultDates(results) : null,
      results: null,
      metadata: {
        id: cachedFilterId,
        lastRunTime: row.time_to_run ? row.time_to_run[row.time_to_run.length - 1] : 0,
        lastRun: new Date(row.last_run).valueOf(),
        viewCount: row.view_count,
        created: new Date(row.created).valueOf(),
        resultCount: row.result_count
      }
    }
  }
  timer.flush()
  return cachedFilter
}

export default getCachedFilter
