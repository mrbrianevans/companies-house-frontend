// this is the get profile service method for a officer
// this file is located in: /interface/getOfficerProfile.ts

import { IOfficerDatabaseItem, IOfficerItem, convertOfficerDatabaseItemToItem } from '../types/IOfficer'
import { FilterCategory } from '../types/FilterCategory'
import { getDatabasePool } from '../helpers/connectToDatabase'
import getFilterConfig from '../helpers/getFilterConfig'
import { Timer } from '../helpers/Timer'

/**
 * get officer profile by officer_id
 *
 * @example
 * const officer = await getOfficerProfile(officer_id)
 *
 * @param  officer_id string the id of the Officer
 * @returns  Officer
 */
export const getOfficerProfile = async (officer_id: string) => {
  const timer = new Timer({
    label: 'getOfficerProfile() method call',
    filename: 'interface/getOfficerProfile.ts',
    details: { officer_id }
  })
  const pool = getDatabasePool()
  const category = FilterCategory.OFFICER
  const config = getFilterConfig({ category })
  const results: IOfficerDatabaseItem[] | null | undefined = await pool
    .query(
      `
      SELECT *
      FROM ${config.main_table}
      WHERE ${config.uniqueIdentifier} = $1
  `,
      [officer_id]
    )
    .then(({ rows }) => rows)
    .catch((e) => timer.postgresError(e))
  if (!results || results?.length === 0) {
    timer.customError('No results returned')
    return null
  }
  await pool.end()
  timer.flush()
  const output: IOfficerItem = convertOfficerDatabaseItemToItem(results[0])
  timer.addDetail('officer name', output.forenames + ' ' + output.surname)
  return output
}
