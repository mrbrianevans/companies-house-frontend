import { getDatabasePool } from '../../helpers/connectToDatabase'
import { IFilter } from '../../types/IFilters'
import { getCompanyFilterList } from './listOfFilters'
import { ICompanyProfile } from '../../types/ICompany'
import { prettyPrintSqlQuery } from '../../helpers/prettyPrintSqlQuery'
// import filterMap from '../../helpers/filters'
// /api/company

// the way this works, is each filter is passed to its corrosponding function
// which returns the sql to filter by it, and then all the sqls are combined
// in the main function with INTERSECT and EXCEPT statements. Only one query is issued (AND RETURNED!)

export const applyCompaniesFilter: (
  filters: IFilter[]
) => Promise<{ query: string; results: ICompanyProfile[] } | undefined> = async (filters) => {
  try {
    const filterMap = getCompanyFilterList()
    const queries: string[] = [],
      values: any[] = []
    let valueCounter = 1
    for (const filter of filters) {
      //each type of filter has a function that returns a sql query
      const { query, value } = filterMap.get(filter.category).filter(filter)
      // updates the $1 references for the number of values
      queries.push(
        query.replace(/\?/gm, () => {
          return '$' + valueCounter++
        })
      )
      values.push(value)
    }
    //combines all the sql queries generated by each filter into one massive sql query
    //todo - if the filter is excluded, it should use EXCEPT rather than INTERSECT
    let bigQuery =
      'WITH matches AS (' +
      queries.join(' INTERSECT ') +
      ')' +
      `
          SELECT DISTINCT ON (c.number, c.name) c.name   as name,
                                                c.number as company_number,
                                                c.category,
                                                c.date   as date_of_creation
          FROM (matches a
                   JOIN companies c ON c.number = a.company_number
                   JOIN detailed_postcodes p ON c.postcode = p.postcode)
          --ORDER BY c.name
          LIMIT 10;
      `
    let bigValue = values.flat()
    const prettyPrintQuery = prettyPrintSqlQuery(bigQuery, bigValue)
    console.log(prettyPrintQuery)
    if (queries.length) {
      try {
        console.time('Filtering companies')
        const pool = await getDatabasePool()
        const { rows: matches } = await pool.query(bigQuery, bigValue)
        console.log('Returned', matches.length, 'rows')
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
        console.timeEnd('Filtering companies')
      }
    } else return { query: prettyPrintQuery, results: [] }
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
