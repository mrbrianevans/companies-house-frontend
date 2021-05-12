import { getDatabasePool } from '../../helpers/connectToDatabase'
import { IFilter } from '../../types/IFilters'
import { getCompanyFilterList } from './listOfFilters'
import { ICompanyProfile } from '../../types/ICompany'
import { prettyPrintSqlQuery } from '../../helpers/prettyPrintSqlQuery'
import { combineQueries } from './combineQueries'
import { getResultCount } from './getResultCount'
import { getFilterId } from '../../helpers/getFilterId'
// import filterMap from '../../helpers/filters'
// /api/company

// the way this works, is each filter is passed to its corrosponding function
// which returns the sql to filter by it, and then all the sqls are combined
// in the main function with INTERSECT and EXCEPT statements. Only one query is issued (AND RETURNED!)

export const applyCompaniesFilter: (
  filters: IFilter[],
  limit?: number
) => Promise<{ query: string; results: ICompanyProfile[] } | undefined> = async (filters, limit = 10) => {
  const startTime = Date.now()
  try {
    const { value: bigValue, query: bigQuery } = combineQueries(filters, limit)
    const prettyPrintQuery = prettyPrintSqlQuery(bigQuery, bigValue)
    // console.log(prettyPrintQuery)

    try {
      const pool = await getDatabasePool()
      const { rows: matches } = await pool.query(bigQuery, bigValue)
      console.log(
        JSON.stringify({
          severity: 'INFO',
          message: `Filtered companies in ${Date.now() - startTime}ms`,
          numberOfResultsReturned: matches.length,
          queryProcessingTime: Date.now() - startTime,
          filters: filters.map((filter) => filter.category).join(', '),
          class: 'company-filter',
          filterObjectId: getFilterId(filters)
        })
      )
      return { query: prettyPrintQuery, results: matches }
    } catch (e) {
      console.log(
        JSON.stringify({
          class: 'company-filter',
          message: 'Failed to filter companies',
          severity: 'ERROR',
          sql: prettyPrintQuery,
          error: e.message
        })
      )
    }
  } catch (e) {
    console.log(
      JSON.stringify({
        class: 'company-filter',
        message: 'Failed to filter companies',
        severity: 'ERROR',
        error: e.message
      })
    )
  }
  return undefined
}
