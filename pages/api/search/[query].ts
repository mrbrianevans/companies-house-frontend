import { NextApiRequest, NextApiResponse } from 'next'
import { getDatabasePool } from '../../../helpers/connectToDatabase'
import { ICompany } from '../../../types/ICompany'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { query }
  } = req
  let searchQuery
  if (typeof query === 'string') searchQuery = query
  else searchQuery = query.join(' ')
  searchQuery = decodeURIComponent(searchQuery).toUpperCase().trim()
  const queryWords = searchQuery.split(' ')
  console.log(`Search query: ${searchQuery}`)
  console.log(`All search words: [${queryWords.join(', ')}]`)
  const pool = getDatabasePool()
  const client = await pool.connect()
  // all the different types of search go here:
  const sqlQueries = [
    'SELECT * FROM companies WHERE lower(name)=lower($1)',
    'SELECT * FROM companies WHERE lower(name)=lower($1)',
    'SELECT * FROM companies WHERE name LIKE $1',
    'SELECT * FROM companies WHERE name LIKE $1',
    'SELECT * FROM companies WHERE name LIKE $1',
    'SELECT * FROM companies WHERE name LIKE ANY($1)'
  ]
  const sqlBindings = [
    [searchQuery],
    [searchQuery + ' LIMITED'],
    [`${searchQuery} %`],
    [`% ${searchQuery} %`],
    [`%${searchQuery}%`],
    [queryWords.map((q) => `%${q}%`)]
  ]
  let combinedResults: ICompany[] = []
  for (
    let rowCount = 0, rowLimit = 20, searchLevels = 0, startTime = Date.now(), timeLimit = 5000;
    rowCount < rowLimit && searchLevels < sqlQueries.length && (Date.now() - startTime < timeLimit || rowCount === 0);
    searchLevels++
  ) {
    console.time(`Querying: (${sqlQueries[searchLevels]}, ${sqlBindings[searchLevels]})`)
    const { rows } = await client.query(
      sqlQueries[searchLevels] + 'ORDER BY LENGTH(name) LIMIT ' + (2 * rowLimit - rowCount),
      sqlBindings[searchLevels]
    )
    rowCount += rows.length
    console.timeEnd(`Querying: (${sqlQueries[searchLevels]}, ${sqlBindings[searchLevels]})`)
    console.log('resulted in ' + rows.length, 'rows')
    combinedResults.push(...rows)
  }
  // @ts-ignore
  const uniqueResults = [...new Set(combinedResults)]
  combinedResults = uniqueResults
  console.time('Get SIC codes for all queries')
  const {
    rows: sics
  } = await client.query(
    'SELECT company_number, description AS sic_code FROM sic, sic_map WHERE company_number=ANY($1) AND sic.sic_code=sic_map.code',
    [combinedResults.map((result) => result.number)]
  )
  console.timeEnd('Get SIC codes for all queries')
  sics.forEach((sic) => {
    if (combinedResults[combinedResults.findIndex((result) => result.number === sic.company_number)].sicCodes)
      combinedResults[combinedResults.findIndex((result) => result.number === sic.company_number)].sicCodes.push(
        sic.sic_code
      )
    else
      combinedResults[combinedResults.findIndex((result) => result.number === sic.company_number)].sicCodes = [
        sic.sic_code
      ]
  })
  client.release()
  await pool.end()
  console.log(combinedResults.length, `results returned`)
  res.status(200).json({ companies: combinedResults, query: searchQuery })
}
