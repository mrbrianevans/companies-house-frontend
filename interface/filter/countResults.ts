// this file is located in: /interface/filter/countResults.ts
// to import from this file, use: import { CountResultsParams, CountResultsOutput, countResults } from '../../interface/filter/countResults'

import { IFilter } from '../../types/IFilters'
import { FilterCategory } from '../../types/FilterCategory'
import { getDatabasePool } from '../../helpers/connectToDatabase'
import { getFilterId } from '../../helpers/getFilterId'
import { Timer } from '../../helpers/Timer'
import combineQueries from './combineQueries'

// input parameters for countResults - filters, category
export interface CountResultsParams {
  filters: IFilter[]
  category: FilterCategory
}

// return type of countResults - count
export interface CountResultsOutput {
  count: number
}

/**
 * countResults interface method
 *
 * @example await countResults({filters, category})
 * @param  CountResultsParams filters, category
 * @returns  CountResultsOutput count
 */
export async function countResults({ filters, category }: CountResultsParams): Promise<CountResultsOutput> {
  const timer = new Timer({ label: 'countResults() method call', filename: 'interface/filter/countResults.ts' })
  const pool = getDatabasePool()
  const id = getFilterId(filters, category)
  const { rows: savedFilterRows } = await pool.query(
    ` 
  SELECT result_count FROM cached_filters WHERE id=$1 AND result_count IS NOT NULL
  `,
    [id]
  )
  if (savedFilterRows.length > 0) {
    // count has already been saved
    timer.flush()
    return { count: savedFilterRows[0].result_count }
  }
  const { value: bigValue, query: bigQuery } = combineQueries({ filters, category })
  const { rows } = await pool.query(
    `
  WITH results AS (${bigQuery}) SELECT COUNT(*) AS count FROM results;
  `,
    bigValue
  )
  const count: number = rows[0].count
  timer.next(`Persist result size ${count} in DB`)
  await pool.query(`UPDATE cached_filters SET result_count=$1 WHERE id=$2 AND category=$3`, [count, id, category])
  timer.flush()

  await pool.end()
  return { count }
}
