// this file is located in: /interface/filter/getFilterId.ts
// to import from this file, use: import { GetFilterIdParams, GetFilterIdOutput, getFilterId } from '../../interface/filter/getFilterId'

import { IFilter } from '../../types/IFilters'
import { FilterCategory } from '../../types/FilterCategory'
import { getDatabasePool } from '../../helpers/connectToDatabase'
import { getFilterId as getFilterIdHelper } from '../../helpers/getFilterId'
import { Timer } from '../../helpers/Timer'
import getFilterConfig from '../../helpers/getFilterConfig'
import combineQueries from './combineQueries'
import { prettyPrintSqlQuery } from '../../helpers/prettyPrintSqlQuery'

// input parameters for getFilterId - filters, category
export interface GetFilterIdParams {
  filters: IFilter[]
  category: FilterCategory
}

// return type of getFilterId - id
export interface GetFilterIdOutput {
  id: string
  // timestamp of the last time this filter was run
  lastRun?: number
}

/**
 * save the filter in cached_filters, return the generated id, DOESN'T SAVE RESULTS
 *
 * @example await getFilterId({filters, category})
 * @param  GetFilterIdParams filters, category
 * @returns  GetFilterIdOutput id of the filter
 */
export async function getFilterId({ filters, category }: GetFilterIdParams): Promise<GetFilterIdOutput> {
  const timer = new Timer({ label: 'getFilterId() method call', filename: 'interface/filter/getFilterId.ts' })
  const pool = getDatabasePool()
  const id = getFilterIdHelper(filters, category)
  const { query, value } = combineQueries({ filters, category })
  const prettyPrintedQuery = prettyPrintSqlQuery(query, value)
  const executeQueryTimer = timer.start('execute query')
  const { rows }: { rows: { id: string; last_run?: Date }[] } = await pool.query(
    `
      INSERT INTO cached_filters 
          (id, category, query, filters, view_count, created) 
      VALUES ($1, $2, $3, $4, 0, CURRENT_TIMESTAMP)
      ON CONFLICT ON CONSTRAINT cached_filters_id_pk 
          -- unfortunately this update is required for the RETURNING
          DO UPDATE SET id=cached_filters.id
      RETURNING id, last_run
  `,
    [id, category, prettyPrintedQuery, filters]
  )
  executeQueryTimer.stop()
  await pool.end()
  timer.flush()
  const output: GetFilterIdOutput = { id: rows[0]?.id, lastRun: rows[0]?.last_run?.valueOf() }
  return output
}
