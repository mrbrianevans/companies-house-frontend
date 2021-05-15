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
  const timer = new Timer({
    label: 'Apply accountants filter to save in DB',
    details: { class: 'save-accountant-filter' }
  })
  const { query, results } = await applyAccountantsFilter(newFilter.filters)
  await pool.query(
    `
    INSERT INTO saved_filters
    (id, category, filters, results, time_to_run, query)
    VALUES 
    ($1, 'ACCOUNTANT', $2, $3, ARRAY[$4::int], $5)
    ON CONFLICT ON CONSTRAINT saved_filters_pk DO UPDATE SET
    last_run=CURRENT_TIMESTAMP, results = $3, 
    time_to_run = array_append(saved_filters.time_to_run, $4),
    query=excluded.query
    `,
    [id, newFilter.filters, results, timer.flush(), query]
  )

  return id
}
