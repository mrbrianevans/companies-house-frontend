import { IFilter } from '../../types/IFilters'
import { getMatchingCompanyNumbers } from './combineQueries'
import { getDatabasePool } from '../../helpers/connectToDatabase'
import { Timer } from '../../helpers/Timer'

export const getResultCount: (filters: IFilter[]) => Promise<number> = async (filters) => {
  const { value: bigValue, query: bigQuery } = getMatchingCompanyNumbers(filters)
  const timer = new Timer({ label: 'Count result set size' })
  const pool = await getDatabasePool()
  const { rows } = await pool.query(
    `
  WITH results AS (${bigQuery}) SELECT COUNT(*) AS count FROM results;
  `,
    bigValue
  )
  timer.flush()

  const count: number = rows[0].count
  // console.log('Counted', count, 'results')
  return count
}
