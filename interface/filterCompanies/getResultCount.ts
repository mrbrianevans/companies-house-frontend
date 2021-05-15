import { IFilter } from '../../types/IFilters'
import { getMatchingCompanyNumbers } from './combineQueries'
import { getDatabasePool } from '../../helpers/connectToDatabase'
import { Timer } from '../../helpers/Timer'
import { prettyPrintSqlQuery } from '../../helpers/prettyPrintSqlQuery'
import { getFilterId } from '../../helpers/getFilterId'

export const getResultCount: (filters: IFilter[]) => Promise<number> = async (filters) => {
  const filterId = getFilterId(filters)
  //todo: check cache for persisted result set size (SELECT result_count FROM saved_filter WHERE id = id)
  const { value: bigValue, query: bigQuery } = getMatchingCompanyNumbers(filters)
  const timer = new Timer({ label: 'Count result set size', details: { filterId, filterType: 'Company' } })
  const pool = await getDatabasePool()
  const { rows } = await pool.query(
    `
  WITH results AS (${bigQuery}) SELECT COUNT(*) AS count FROM results;
  `,
    bigValue
  )
  const count: number = rows[0].count
  timer.next(`Persist result size ${count} in DB`)
  await pool.query(`UPDATE saved_filters SET result_count=$1 WHERE id=$2 AND category='COMPANY'`, [count, filterId])
  timer.flush()

  return count
}
