import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabasePool } from '../../../helpers/connectToDatabase'
import { IFilter } from '../../../types/IFilters'
import filterMap from '../../../helpers/filters'
// /api/accountants/filter

// the way this works, is each filter is passed to its corrosponding function
// which returns the sql to filter by it, and then all the sqls are combined
// in the main function with INTERSECT and EXCEPT statements. Only one query is issued (AND RETURNED!)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { body: filters }: { body: IFilter[] } = req
    // console.log("REQUEST FILTERS: ", filters);
    const queries: string[] = [],
      values: any[] = []
    let valueCounter = 1
    for (const filter of filters) {
      //each type of filter has a function that returns a sql query
      const { query, value } = filterMap.get(filter.category)(filter)
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
          SELECT DISTINCT ON (a.name_on_accounts, a.number_of_clients) a.name_on_accounts,
                                                                       a.company_number,
                                                                       a.software,
                                                                       a.number_of_clients,
                                                                       p.built_up_area as area,
                                                                       c.date,
                                                                       c.status,
                                                                       c.streetaddress
          FROM (matches a
                   JOIN companies c ON c.number = a.company_number
                   JOIN detailed_postcodes p ON c.postcode = p.postcode)
--                ,
--                detailed_postcodes p
--           WHERE c.postcode = p.postcode
          ORDER BY a.number_of_clients DESC
          LIMIT 10;
      `
    let bigValue = values.flat()
    const prettyPrintQuery = bigQuery.replace(/\$[0-9]+/gm, (dollarN) => {
      const value = bigValue[Number(dollarN.slice(1)) - 1]
      if (typeof value === 'number') return value
      else if (typeof value === 'stri"string"urn `'${value}'`
    ;  else if (typeof value === 'obje"object"urn "ARRAY['" + value.join("','") + "']"
    ;  else return value
    ;})
    console.log(prettyPrintQuery)
    if (queries.length) {
      try {
        console.time('Filtering accountants')
        const pool = await getDatabasePool()
        const { rows: matches } = await pool.query(bigQuery, bigValue)
        console.log('Returned', matches.length, 'rows')
        res.status(200).json(matches)
      } catch (e) {
        res.status(501).json({ sql: prettyPrintQuery, error: e.message })
      } finally {
        console.timeEnd('Filtering accountants')
      }
    } else res.json({ sql: prettyPrintQuery })
  } catch (e) {
    res.status(501).json({ error: e.message })
  }
}
