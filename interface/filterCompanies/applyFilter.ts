import { getDatabasePool } from '../../helpers/connectToDatabase'
import { IFilter } from '../../types/IFilters'
import { getCompanyFilterList } from './listOfFilters'
import { ICompanyProfile } from '../../types/ICompany'
import { prettyPrintSqlQuery } from '../../helpers/prettyPrintSqlQuery'
import { combineQueries } from './combineQueries'
import { getResultCount } from './getResultCount'
// import filterMap from '../../helpers/filters'
// /api/company

// the way this works, is each filter is passed to its corrosponding function
// which returns the sql to filter by it, and then all the sqls are combined
// in the main function with INTERSECT and EXCEPT statements. Only one query is issued (AND RETURNED!)

export const applyCompaniesFilter: (
  filters: IFilter[]
) => Promise<{ query: string; results: ICompanyProfile[] } | undefined> = async (filters) => {
  const startTime = Date.now()
  try {
    const { value: bigValue, query: bigQuery } = combineQueries(filters, 10)
    const prettyPrintQuery = prettyPrintSqlQuery(bigQuery, bigValue)
    // console.log(prettyPrintQuery)

    try {
      // console.time('Filtering companies')
      const pool = await getDatabasePool()
      const { rows: matches } = await pool.query(bigQuery, bigValue)
      const hash = require('object-hash')
      console.log(
        JSON.stringify({
          severity: 'INFO',
          message: `Filtered companies in ${Date.now() - startTime}ms`,
          numberOfResultsReturned: matches.length,
          queryProcessingTime: Date.now() - startTime,
          filters: filters.map((filter) => filter.category).join(', '),
          class: 'company-filter',
          filterObjectHash: hash(filters)
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
    } finally {
      // console.timeEnd('Filtering companies')
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
