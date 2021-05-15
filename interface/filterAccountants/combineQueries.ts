import { IFilter } from '../../types/IFilters'
import { IMinorQuery } from '../../types/IQueries'
import { getAccountantFilterList } from './listOfFilters'
export const combineQueries: (filters: IFilter[], limit?: number) => IMinorQuery = (filters, limit) => {
  const { query: innerQuery, value: bigValue } = getMatchingAccountantNames(filters)
  let bigQuery = `WITH matches AS (${innerQuery})
       SELECT DISTINCT ON (a.name_on_accounts, a.number_of_clients) a.name_on_accounts,
                                                                    a.company_number,
                                                                    a.software,
                                                                    a.number_of_clients,
                                                                    p.built_up_area as area,
                                                                    c.date,
                                                                    c.status,
                                                                    c.streetaddress
       FROM (matches a
                LEFT JOIN companies c ON c.number = a.company_number
                LEFT JOIN detailed_postcodes p ON c.postcode = p.postcode)
--                ,
--                detailed_postcodes p
--           WHERE c.postcode = p.postcode
       ORDER BY a.number_of_clients DESC
       LIMIT 10;
      `
  return { query: bigQuery, value: bigValue }
}
export const getMatchingAccountantNames: (filters: IFilter[]) => IMinorQuery = (filters) => {
  const filterMap = getAccountantFilterList()
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
    return { query: 'SELECT name_on_accounts FROM accountants LIMIT 1', value: [] }
  }
  let bigQuery = queries.join(' INTERSECT ')
  let bigValue = values.flat()
  return { query: bigQuery, value: bigValue }
}
