import { getDatabasePool } from '../../helpers/connectToDatabase'
import { ISavedFilter } from '../../types/ISavedFilter'
import { ICompanyProfile } from '../../types/ICompany'

/**
 * Fetches a company filter with its results from the database by the filter ID
 *
 * @returns SavedFilter the filter saved in the database, or null if not found
 */
export const getSavedFilter: (id: string) => Promise<ISavedFilter<ICompanyProfile> | null> = async (id) => {
  const pool = await getDatabasePool()
  const { rows } = await pool.query(
    `
    UPDATE saved_filters SET 
                             last_viewed=CURRENT_TIMESTAMP,
                             view_count=view_count+1
    WHERE id=$1 AND category='COMPANY'
    RETURNING view_count, created, filters, results, last_run, time_to_run
  `,
    [id]
  )
  if (rows.length !== 1) {
    return null
  }
  return {
    appliedFilters: rows[0].filters,
    results: rows[0].results,
    metadata: {
      id,
      lastRunTime: rows[0].time_to_run.sort()[0],
      lastRun: new Date(rows[0].last_run).valueOf(),
      viewCount: rows[0].view_count,
      created: new Date(rows[0].created).valueOf()
    }
  }
}
