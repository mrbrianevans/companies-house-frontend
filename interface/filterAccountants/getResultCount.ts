import { IFilter } from '../../types/IFilters'
import { getMatchingAccountantNames } from './combineQueries'
import { getDatabasePool } from '../../helpers/connectToDatabase'
import { Timer } from '../../helpers/Timer'
import { getFilterId } from '../../helpers/getFilterId'
import { FilterCategory } from '../../types/FilterCategory'

export const getResultCount: (filters: IFilter[]) => Promise<number> = async (filters) => {
  const filterId = getFilterId(filters, FilterCategory.ACCOUNTANT)
  //todo: check cache for persisted result set size (SELECT result_count FROM saved_filter WHERE id = id)
  const { value: bigValue, query: bigQuery } = getMatchingAccountantNames(filters)
  const timer = new Timer({ label: 'Count result set size', details: { filterId, filterType: 'Accountant' } })
  const pool = await getDatabasePool()
  const { rows } = await pool.query(
    `
  WITH results AS (${bigQuery}) SELECT COUNT(*) AS count FROM results;
  `,
    bigValue
  )
  const count: number = rows[0].count
  timer.next(`Persist result size ${count} in DB`)
  await pool.query(`UPDATE saved_filters SET result_count=$1 WHERE id=$2 AND category='ACCOUNTANT'`, [count, filterId])
  timer.flush()

  return count
}
