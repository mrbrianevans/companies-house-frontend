import { IFilter } from '../../types/IFilters'
import { getCompanyFilterList } from './listOfFilters'
import { prettyPrintSqlQuery } from '../../helpers/prettyPrintSqlQuery'
import { IMinorQuery } from '../../types/IQueries'

export const combineQueries: (filters: IFilter[], limit?: number) => IMinorQuery = (filters, limit) => {
  const { query: innerQuery, value: bigValue } = getMatchingCompanyNumbers(filters)
  //combines all the sql queries generated by each filter into one massive sql query
  //todo - if the filter is excluded, it should use EXCEPT rather than INTERSECT
  let bigQuery = `WITH matches AS (${innerQuery})
     SELECT DISTINCT ON (c.number, c.name) c.name   as name,
                                           c.number as company_number,
                                           c.category,
                                           c.date   as date_of_creation
     FROM (matches a
         JOIN companies c ON c.number = a.company_number
         JOIN detailed_postcodes p ON c.postcode = p.postcode) ${limit ? 'LIMIT ' + limit : ''}
    `

  // const prettyPrintQuery = prettyPrintSqlQuery(bigQuery, bigValue)
  // console.log('in the combine queries file', prettyPrintQuery)
  return { query: bigQuery, value: bigValue }
}

export const getMatchingCompanyNumbers: (filters: IFilter[]) => IMinorQuery = (filters) => {
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
  if (queries.length == 0) {
    return { query: 'SELECT number FROM companies LIMIT 1', value: [] }
  }
  let bigQuery = queries.join(' INTERSECT ')
  let bigValue = values.flat()
  return { query: bigQuery, value: bigValue }
}
