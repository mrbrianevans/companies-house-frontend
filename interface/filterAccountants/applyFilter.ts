import { getDatabasePool } from '../../helpers/connectToDatabase'
import { IFilter } from '../../types/IFilters'
import { getAccountantFilterList } from './listOfFilters'
import { IAccountant } from '../../types/IAccountant'
import { combineQueries } from './combineQueries'
import { prettyPrintSqlQuery } from '../../helpers/prettyPrintSqlQuery'
import { Timer } from '../../helpers/Timer'
// import filterMap from '../../helpers/filters'
// /api/accountants/filter

// the way this works, is each filter is passed to its corrosponding function
// which returns the sql to filter by it, and then all the sqls are combined
// in the main function with INTERSECT and EXCEPT statements. Only one query is issued (AND RETURNED!)

export const applyAccountantsFilter: (
  filters: IFilter[],
  limit?: number
) => Promise<{ query: string; results: IAccountant[] } | undefined> = async (filters, limit) => {
  try {
    const { value: bigValue, query: bigQuery } = combineQueries(filters, limit)

    //combines all the sql queries generated by each filter into one massive sql query
    //todo - if the filter is excluded, it should use EXCEPT rather than INTERSECT
    const prettyPrintQuery = prettyPrintSqlQuery(bigQuery, bigValue)
    // console.log(prettyPrintQuery)
    try {
      const timer = new Timer({ label: 'Filter accountants', details: { class: 'filter-accountants' } })
      const pool = await getDatabasePool()
      const { rows: matches } = await pool.query(bigQuery, bigValue)
      timer.flush()
      return { query: prettyPrintQuery, results: matches }
    } catch (e) {
      console.log(
        JSON.stringify({
          class: 'accountant-filter',
          message: 'Failed to filter accountants',
          severity: 'ERROR',
          sql: prettyPrintQuery,
          error: e.message
        })
      )
    } finally {
    }
  } catch (e) {
    console.log(
      JSON.stringify({
        class: 'accountant-filter',
        message: 'Failed to filter accountants',
        severity: 'ERROR',
        error: e.message
      })
    )
  }
  return undefined
}
