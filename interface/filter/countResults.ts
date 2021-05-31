import { IFilter } from '../../types/IFilters'
import { FilterCategory } from '../../types/FilterCategory'
import { getFilterId } from '../../helpers/getFilterId'
import { getMatchingCompanyNumbers } from '../filterCompanies/combineQueries'
import { Timer } from '../../helpers/Timer'
import { getDatabasePool } from '../../helpers/connectToDatabase'

// todo: move to types directory for frontend access
interface CountResultsParams {
  filters: IFilter[]
  category: FilterCategory
}
/** takes a list of filters, combines the queries, queries the database for COUNT(combinedQueries) with no limit*/
const countResults: (params: CountResultsParams) => Promise<number> = async ({ filters, category }) => {
  const filterId = getFilterId(filters, category)
  const timer = new Timer({ label: 'Count result set size', details: { filterId, filterType: category } })
  // check cache for persisted result set size
  const pool = await getDatabasePool()
  const { rows: savedFilterRows } = await pool.query(
    `
  SELECT result_count FROM saved_filters WHERE id=$1
  `,
    [filterId]
  )
  if (savedFilterRows.length > 0) {
    // count has already been saved
    return savedFilterRows[0].result_count
  }
  const { value: bigValue, query: bigQuery } = getMatchingCompanyNumbers(filters)
  const { rows } = await pool.query(
    `
  WITH results AS (${bigQuery}) SELECT COUNT(*) AS count FROM results;
  `,
    bigValue
  )
  const count: number = rows[0].count
  timer.next(`Persist result size ${count} in DB`)
  await pool.query(`UPDATE saved_filters SET result_count=$1 WHERE id=$2 AND category=$3`, [count, filterId, category])
  timer.flush()

  return count
}

export default countResults
