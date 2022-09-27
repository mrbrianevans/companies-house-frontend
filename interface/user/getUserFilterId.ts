// this file is located in: /interface/user/getUserFilterId.ts
// to import from this file, use: import { GetUserFilterIdParams, GetUserFilterIdOutput, getUserFilterId } from '../../interface/user/getUserFilterId'

import { getDatabasePool } from '../../helpers/sql/connectToDatabase'
import { Timer } from '../../helpers/Timer'

// input parameters for getUserFilterId - cachedFilterId
export interface GetUserFilterIdParams {
  cachedFilterId: any
  userId?: number
}

// return type of getUserFilterId - userFilterId
export interface GetUserFilterIdOutput {
  userFilterId: any
}

/**
 * getUserFilterId interface method
 *
 * @example await getUserFilterId({cachedFilterId})
 * @param  GetUserFilterIdParams cachedFilterId
 * @returns  GetUserFilterIdOutput userFilterId
 */
export async function getUserFilterId({
  cachedFilterId,
  userId
}: GetUserFilterIdParams): Promise<GetUserFilterIdOutput> {
  const timer = new Timer({ label: 'getUserFilterId() method call', filename: 'interface/user/getUserFilterId.ts' })
  const pool = getDatabasePool()
  const userFilterId = await pool
    .query(
      `
      SELECT id FROM user_filters WHERE cached_filter_fk = $1 AND user_id_fk = $2
  `,
      [cachedFilterId, userId]
    )
    .then(({ rows }) => rows[0]?.id ?? null)
    .catch((e) => timer.postgresError(e))
  await pool.end()
  timer.flush()
  const output: GetUserFilterIdOutput = { userFilterId }
  return output
}
