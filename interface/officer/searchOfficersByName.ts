// this file is located in: /interface/officer/searchOfficersByName.ts
// to import from this file, use: import { SearchOfficersByNameParams, SearchOfficersByNameOutput, searchOfficersByName } from '../../interface/officer/searchOfficersByName'

import { getDatabasePool } from '../../helpers/sql/connectToDatabase'
import { Timer } from '../../helpers/Timer'
import { convertOfficerDatabaseItemToItem, IOfficerDatabaseItem, IOfficerItem } from '../../types/IOfficer'
import { IDetailedPostcodesDatabaseItem } from '../../types/IDetailedPostcodes'

// input parameters for searchOfficersByName - query
export interface SearchOfficersByNameParams {
  query: string
}

// return type of searchOfficersByName - officers
export interface SearchOfficersByNameOutput {
  results: IOfficerDatabaseItem[]
}

/**
 * searchOfficersByName interface method
 *
 * @example await searchOfficersByName({query})
 * @param  SearchOfficersByNameParams query search term
 * @returns  SearchOfficersByNameOutput officers array of officers whose names match the search term
 */
export async function searchOfficersByName({ query }: SearchOfficersByNameParams): Promise<SearchOfficersByNameOutput> {
  const timer = new Timer({
    label: 'searchOfficersByName() method call',
    filename: 'interface/officer/searchOfficersByName.ts',
    details: { query }
  })

  const splitQuery = query
    .split(' ')
    .map((s) => s.replace(/[^a-zA-Z0-9-_]/, ''))
    .map((s) => s.trim())
    .filter((s) => s.length)
    .join(' & ')
  timer.addDetails({ splitQuery })
  const pool = getDatabasePool()
  const queryTimer = timer.start('Query officers database for search term')
  const result = await pool
    .query(
      `
      SELECT *, ts_rank_cd(officer_name_vector, to_tsquery('brian & evans')) AS rank
      FROM person_officers JOIN detailed_postcodes dp on person_officers.post_code = dp.postcode
      WHERE officer_name_vector @@ to_tsquery('simple', $1 )
      ORDER BY rank DESC
      LIMIT 20
  `,
      [splitQuery]
    )
    .then(({ rows }: { rows: (IOfficerDatabaseItem & IDetailedPostcodesDatabaseItem)[] }) => rows)
    .catch((e) => timer.postgresErrorReturn([])(e))
  queryTimer.stop()
  if (!result || result?.length === 0) timer.customError('No results returned')
  timer.addDetail('number of results', result.length)
  if (result.length) timer.addDetail('first result', result[0].forenames + ' ' + result[0].surname)
  await pool.end()
  timer.flush()
  const output: SearchOfficersByNameOutput = Object.freeze({
    results: result
  })
  return output
}
