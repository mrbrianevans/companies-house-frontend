import { getDatabasePool } from '../../helpers/connectToDatabase'
import { IFilter } from '../../types/IFilters'
import { IAccountant } from '../../types/IAccountant'
interface SavedFilter {
  viewCount: number
  // timestamp in ms when this filter was first saved
  created: number
  filters: IFilter[]
  results: IAccountant[]
  // timestamp of the last time this query was run
  lastRun: number
}
export const getSavedFilter: (id: string) => Promise<SavedFilter | null> = async (id) => {
  const pool = await getDatabasePool()
  const { rows } = await pool.query(
    `
    UPDATE saved_filters SET 
                             last_viewed=CURRENT_TIMESTAMP,
                             view_count=view_count+1
    WHERE id=$1 AND category='ACCOUNTANT'
    RETURNING view_count, created, filters, results, last_run
  `,
    [id]
  )
  if (rows.length !== 1) {
    return null
  }
  return {
    created: new Date(rows[0].created).valueOf(),
    filters: rows[0].filters,
    results: rows[0].results,
    lastRun: new Date(rows[0].last_run).valueOf(),
    viewCount: rows[0].view_count
  }
}
