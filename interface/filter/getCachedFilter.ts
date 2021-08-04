import { getDatabasePool } from '../../helpers/connectToDatabase'
import { ICachedFilter } from '../../types/ICachedFilter'
import { FilterCategory } from '../../types/FilterCategory'
import getFilterConfig from '../../helpers/getFilterConfig'
import { serialiseResultDates } from '../../helpers/serialiseResultDates'
import { Timer } from '../../helpers/Timer'
import { ICachedFiltersDatabaseItem } from '../../types/ICachedFiltersDatabaseItem'
import { IFilterValue } from '../../types/IFilters'
import { UserRole } from '../../types/IUser'

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
  const row: ICachedFiltersDatabaseItem = await pool
    .query(
      `
        UPDATE cached_filters
        SET last_viewed=CURRENT_TIMESTAMP,
            view_count=view_count + 1
        WHERE id = $1
        RETURNING *
    `,
      [cachedFilterId]
    )
    .then(({ rows }) => rows[0])
    .catch(timer.postgresErrorReturn(null))

  let cachedFilter: ICachedFilter<FilterResultsType>
  if (!row) {
    // filter has not been cached
    timer.customError('Cached filter is null')
    cachedFilter = null
  } else {
    cachedFilter = {
      appliedFilters: row.filters as IFilterValue[],
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
