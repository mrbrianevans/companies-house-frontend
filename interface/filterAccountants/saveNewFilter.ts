import { IFilter } from '../../types/IFilters'
import { getDatabasePool } from '../../helpers/connectToDatabase'
import { getFilterId } from '../../helpers/getFilterId'
import { applyAccountantsFilter } from './applyFilter'
import { Timer } from '../../helpers/Timer'

interface NewFilter {
  filters: IFilter[]
}

export const saveNewFilter: (newFilter: NewFilter) => Promise<string> = async (newFilter) => {
  const pool = getDatabasePool()
  const id = getFilterId(newFilter.filters)
  const timer = new Timer({ label: 'Apply accountants filter to save in DB' })
  const { query, results } = await applyAccountantsFilter(newFilter.filters)
  console.log('filters to save to DB: ', newFilter.filters)
  await pool.query(
    `
    INSERT INTO saved_filters
    (id, accountant, filters, results, time_to_run, query)
    VALUES 
    ($1, $2, $3, $4, ARRAY[$5::int], $6)
    ON CONFLICT (id) DO UPDATE SET
    last_run=CURRENT_TIMESTAMP, results = $4, 
    time_to_run = array_append(saved_filters.time_to_run, $5),
    query=excluded.query
    `,
    [id, true, newFilter.filters, results, timer.flush(), query]
  )

  return id
}
