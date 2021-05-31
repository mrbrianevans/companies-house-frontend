// todo: move to types directory for frontend access
import { getDatabasePool } from '../../helpers/connectToDatabase'
import { ISavedFilter } from '../../types/ISavedFilter'
import { FilterCategory } from '../../types/FilterCategory'
import getFilterConfig from '../../helpers/getFilterConfig'

interface GetCachedFilterParams {
  cachedFilterId: string
  category: FilterCategory
}
interface GetCachedFilterOutput {}
/**
 * returns the results and some metadata about a previously cached filter
 */
const getCachedFilter: (params: GetCachedFilterParams) => Promise<ISavedFilter<any> | null> = async ({ cachedFilterId }) => {
  const pool = await getDatabasePool()
  const { rows } = await pool.query(
    `
        UPDATE cached_filters
        SET last_viewed=CURRENT_TIMESTAMP,
            view_count=view_count + 1
        WHERE id = $1
        RETURNING view_count, created, filters, results, last_run, time_to_run, category
    `,
    [cachedFilterId]
  )
  if (rows.length !== 1) {
    // filter has not been cached
    return null
  }
  //todo: join the cached filter on cached_filter_records returning {metadata: {}, results: {}}
  const filterConfig = getFilterConfig({category: rows[0].category})
  const {rows: testRows} = await pool.query(`
      WITH filter_metadata AS (
          UPDATE cached_filters
              SET last_viewed=CURRENT_TIMESTAMP,
                  view_count=view_count + 1
              WHERE id = $1
              RETURNING id, view_count, created, filters, last_run, time_to_run
      )
      SELECT row_to_json(fm)::text AS metadata, array_agg(row_to_json(m)) AS results
      -- selecting row_to_json is problematic for grouping. Might be better to use another with clause
      FROM filter_metadata fm
               LEFT JOIN cached_filter_results cfr ON cfr.filter_fk=fm.id
               LEFT JOIN ${filterConfig.main_table} m ON cfr.data_fk = m.${filterConfig.uniqueIdentifier}
      GROUP BY 1;
  `, [cachedFilterId])
  return {
    appliedFilters: rows[0].filters,
    results: rows[0].results,
    metadata: {
      id: cachedFilterId,
      lastRunTime: rows[0].time_to_run.sort()[0],
      lastRun: new Date(rows[0].last_run).valueOf(),
      viewCount: rows[0].view_count,
      created: new Date(rows[0].created).valueOf()
    }
  }
}

export default getCachedFilter
