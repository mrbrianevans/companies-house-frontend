import { getDatabasePool } from '../../helpers/connectToDatabase'
import { ICachedFilter } from '../../types/ICachedFilter'
import { FilterCategory } from '../../types/FilterCategory'
import { serialiseResultDates } from '../../helpers/serialiseResultDates'
import { Timer } from '../../helpers/Timer'
import { ICachedFiltersDatabaseItem } from '../../types/ICachedFiltersDatabaseItem'
import { IFilterValue } from '../../types/IFilters'
import { getItemById } from './getItemById'

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
    .catch((e) => timer.postgresErrorReturn(null)(e))

  let cachedFilter: ICachedFilter<FilterResultsType>
  if (!row) {
    // filter has not been cached
    timer.customError('Cached filter is null')
    cachedFilter = null
  } else {
    /*
    To fetch the cached results from the database:
    1. get the list of item unique identifiers cached
    2. get the items associated with that ID indiviually

    While this can be done in a single SQL query, it is SIGNIFICANTLY slower due to a poor query plan.
    Using Promise.all() to get the items means it only takes as long as the longest individual item (very quick).
     */
    const category = row.category
    timer.start('fetch cached result ids from database')
    const resultIds: string[] = await pool
      .query(`SELECT data_fk FROM cached_filter_results cfr WHERE cfr.filter_fk=$1`, [cachedFilterId])
      .then(({ rows }: { rows: { data_fk: string }[] }) => rows.map((row) => row.data_fk))
      .catch((e) => timer.postgresErrorReturn([])(e))
    timer.next('fetch items from ids array')
    let resultItems: { item: FilterResultsType }[] = await Promise.all(
      resultIds.map((id) => getItemById<FilterResultsType>({ id, category }))
    )
    const results = resultItems.map((result) => result.item)
    timer.end()
    timer.addDetail('number of results fetched from cache', results.length)
    cachedFilter = {
      appliedFilters: row.filters as IFilterValue[],
      results: results.length ? serialiseResultDates(results) : null,
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
  await pool.end()
  timer.flush()
  return cachedFilter
}

export default getCachedFilter
