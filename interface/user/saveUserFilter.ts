// this file is located in: /interface/user/saveUserFilter.ts
// to import from this file, use: import { SaveUserFilterParams, SaveUserFilterOutput, saveUserFilter } from '../../interface/user/saveUserFilter'

import { IFilter } from '../../types/IFilters'
import { FilterCategory } from '../../types/FilterCategory'
import { getDatabasePool } from '../../helpers/connectToDatabase'
import { getFilterId } from '../../helpers/getFilterId'
import { Timer } from '../../helpers/Timer'
import getFilterConfig from '../../helpers/getFilterConfig'
import { logPostgresError } from '../../helpers/loggers/PostgresErrorLogger'

// input parameters for saveUserFilter - savedFilterId
export interface SaveUserFilterParams {
  savedFilterId: string
  userId?: number
}

// return type of saveUserFilter - userFilterId
export interface SaveUserFilterOutput {
  userFilterId: number
}

/**
 * saveUserFilter interface method
 *
 * @example await saveUserFilter({savedFilterId})
 * @param  SaveUserFilterParams savedFilterId
 * @returns  SaveUserFilterOutput userFilterId
 */
export async function saveUserFilter({ savedFilterId, userId }: SaveUserFilterParams): Promise<SaveUserFilterOutput> {
  const timer = new Timer({
    label: `saveUserFilter(${savedFilterId}, ${userId}) method call`,
    filename: 'interface/user/saveUserFilter.ts'
  })
  const pool = getDatabasePool()
  try {
    const result: void | { rows: { id: number }[] } = await pool.query(
      `
INSERT INTO user_filters (cached_filter_fk, user_id_fk)
VALUES ($1, $2)
RETURNING user_filters.id AS id
  `,
      [savedFilterId, userId]
    )
    if (result && result.rows.length === 1) {
      const output: SaveUserFilterOutput = { userFilterId: result.rows[0].id }
      return output
    }
  } catch (e) {
    logPostgresError(e)
  } finally {
    await pool.end()
    timer.flush()
  }
  return null
}
