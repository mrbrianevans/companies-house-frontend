import { IFilter } from '../../types/IFilters'
import { combineQueries } from './combineQueries'
import { getDatabasePool } from '../../helpers/connectToDatabase'

export const getResultCount: (filters: IFilter[]) => Promise<number> = async (filters) => {
  const { value: bigValue, query: bigQuery } = combineQueries(filters)
  console.time('Calculate result size')
  const pool = await getDatabasePool()
  const { rows } = await pool.query(
    `
  WITH results AS (${bigQuery}) SELECT COUNT(*) AS count FROM results;
  `,
    bigValue
  )
  console.timeEnd('Calculate result size')

  const count: number = rows[0].count
  console.log('Counted', count, 'results')
  return count
}
