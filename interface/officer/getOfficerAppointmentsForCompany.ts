// this file is located in: /interface/officer/getOfficerAppointmentsForCompany.ts
// to import from this file, use: import { GetOfficerAppointmentsForCompanyParams, GetOfficerAppointmentsForCompanyOutput, getOfficerAppointmentsForCompany } from '../../interface/officer/getOfficerAppointmentsForCompany'

import { getDatabasePool } from '../../helpers/connectToDatabase'
import { Timer } from '../../helpers/Timer'
import {
  convertOfficerAppointmentsDatabaseItemToItem,
  IOfficerAppointmentsDatabaseItem,
  IOfficerAppointmentWithOfficer
} from '../../types/IOfficerAppointments'
import { convertOfficerDatabaseItemToItem, IOfficerDatabaseItem } from '../../types/IOfficer'
import { convertDetailPostcodesToAddress, IDetailedPostcodesDatabaseItem } from '../../types/IDetailedPostcodes'

// input parameters for getOfficerAppointmentsForCompany - companyNumber
export interface GetOfficerAppointmentsForCompanyParams {
  companyNumber: string
}

// return type of getOfficerAppointmentsForCompany - officers
export interface GetOfficerAppointmentsForCompanyOutput {
  officers: IOfficerAppointmentWithOfficer[]
}

/**
 * getOfficerAppointmentsForCompany interface method
 *
 * @example await getOfficerAppointmentsForCompany({companyNumber})
 * @param  GetOfficerAppointmentsForCompanyParams companyNumber
 * @returns  GetOfficerAppointmentsForCompanyOutput officers
 */
export async function getOfficerAppointmentsForCompany({
  companyNumber
}: GetOfficerAppointmentsForCompanyParams): Promise<GetOfficerAppointmentsForCompanyOutput> {
  const timer = new Timer({
    label: 'getOfficerAppointmentsForCompany() method call',
    filename: 'interface/officer/getOfficerAppointmentsForCompany.ts'
  })
  const pool = getDatabasePool()
  const results: {
    appointment: IOfficerAppointmentsDatabaseItem
    person: IOfficerDatabaseItem
    officer_address: IDetailedPostcodesDatabaseItem
  }[] = await pool
    .query(
      `
          SELECT    row_to_json(oa.*) AS appointment
                  , row_to_json(po.*) AS person
                  , row_to_json(dpo.*) AS officer_address
          FROM officer_appointments oa
                   JOIN person_officers po ON oa.person_number = po.person_number
                   JOIN detailed_postcodes dpo ON po.post_code = dpo.postcode
          WHERE oa.company_number = $1
      `,
      [companyNumber]
    )
    .then(({ rows }) => rows)
    .catch((e) => timer.postgresErrorReturn([])(e))
  if (!results || results?.length === 0) timer.customError('No results returned for officer by person number')
  timer.addDetail('number of appointments found', results.length)
  await pool.end()
  timer.flush()
  const officers: IOfficerAppointmentWithOfficer[] = results.map((result) => ({
    appointment: convertOfficerAppointmentsDatabaseItemToItem(result.appointment),
    officer: convertOfficerDatabaseItemToItem(result.person),
    officerAddress: convertDetailPostcodesToAddress(result.officer_address, result.person.address_line_1)
  }))
  const output: GetOfficerAppointmentsForCompanyOutput = { officers }
  return output
}
