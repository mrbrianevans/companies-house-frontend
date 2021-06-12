import { getDatabasePool } from '../../helpers/connectToDatabase'
import { ICachedFilter } from '../../types/ICachedFilter'
import { FilterCategory } from '../../types/FilterCategory'
import getFilterConfig from '../../helpers/getFilterConfig'
import { serialiseResultDates } from '../../helpers/serialiseResultDates'

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
  const pool = await getDatabasePool()
  // get the filter metadata
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
  if (rows.length !== 1) {
    // filter has not been cached
    return null
  }
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
  const cachedFilter: ICachedFilter<FilterResultsType> = {
    appliedFilters: rows[0].filters,
    // results: results.length ? serialiseResultDates(results) : null,
    results: null,
    metadata: {
      id: cachedFilterId,
      lastRunTime: rows[0].time_to_run ? rows[0].time_to_run[rows[0].time_to_run.length - 1] : 0,
      lastRun: new Date(rows[0].last_run).valueOf(),
      viewCount: rows[0].view_count,
      created: new Date(rows[0].created).valueOf()
    }
  }
  return cachedFilter
}

export default getCachedFilter
