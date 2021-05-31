import { IFilter } from '../../types/IFilters'
import { getDatabasePool } from '../../helpers/connectToDatabase'
import { getFilterId } from '../../helpers/getFilterId'
import { applyCompaniesFilter } from './applyFilter'
import { Timer } from '../../helpers/Timer'
import { FilterCategory } from '../../types/FilterCategory'

interface NewFilter {
  filters: IFilter[]
}

export const saveNewFilter: (newFilter: NewFilter) => Promise<string> = async (newFilter) => {
  const pool = getDatabasePool()
  const id = getFilterId(newFilter.filters, FilterCategory.COMPANY)
  const timer = new Timer({ label: 'Apply company filter to save in DB' })
  // only saves the top 10 results in the database
  const { query, results } = await applyCompaniesFilter(newFilter.filters, 10)
  await pool.query(
    `
    INSERT INTO saved_filters
    (id, category, filters, results, time_to_run, query)
    VALUES 
     --todo: this COMPANY constant should be a typescript enum parameter
    ($1, 'COMPANY', $2, $3, ARRAY[$4::int], $5)
    ON CONFLICT ON CONSTRAINT saved_filters_pk DO UPDATE SET
    last_run=CURRENT_TIMESTAMP, results = $3, 
    time_to_run = array_append(saved_filters.time_to_run, $4),
    query=excluded.query
    `,
    [id, newFilter.filters, results, timer.flush(), query]
  )

  return id
}
