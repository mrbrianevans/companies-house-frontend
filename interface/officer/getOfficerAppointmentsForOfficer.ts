// this file is located in: /interface/officer/getOfficerAppointmentsForOfficer.ts
// to import from this file, use: import { GetOfficerAppointmentsForOfficerParams, GetOfficerAppointmentsForOfficerOutput, getOfficerAppointmentsForOfficer } from '../../interface/officer/getOfficerAppointmentsForOfficer'

import { getDatabasePool } from '../../helpers/connectToDatabase'
import { Timer } from '../../helpers/Timer'
import {
  convertOfficerAppointmentsDatabaseItemToItem,
  IOfficerAppointmentFullDetails,
  IOfficerAppointmentsDatabaseItem
} from '../../types/IOfficerAppointments'
import { convertCompaniesDatabaseItemToItem, ICompaniesDatabaseItem } from '../../types/ICompanies'
import {
  convertWideAccountsCombinedDatabaseItemToItem,
  IWideAccountsCombinedDatabaseItem
} from '../../types/IWideAccountsCombined'
import { convertDetailPostcodesToAddress, IDetailedPostcodesDatabaseItem } from '../../types/IDetailedPostcodes'
import { IOfficerDatabaseItem } from '../../types/IOfficer'

// input parameters for getOfficerAppointmentsForOfficer - personNumber
export interface GetOfficerAppointmentsForOfficerParams {
  personNumber: string
}

// return type of getOfficerAppointmentsForOfficer - officerAppointments
export interface GetOfficerAppointmentsForOfficerOutput {
  officerAppointments: IOfficerAppointmentFullDetails[]
}

/**
 * getOfficerAppointmentsForOfficer interface method
 *
 * @example await getOfficerAppointmentsForOfficer({personNumber})
 * @param  GetOfficerAppointmentsForOfficerParams personNumber
 * @returns  GetOfficerAppointmentsForOfficerOutput officerAppointments
 */
export async function getOfficerAppointmentsForOfficer({
  personNumber
}: GetOfficerAppointmentsForOfficerParams): Promise<GetOfficerAppointmentsForOfficerOutput> {
  const timer = new Timer({
    label: 'getOfficerAppointmentsForOfficer() method call',
    filename: 'interface/officer/getOfficerAppointmentsForOfficer.ts',
    details: { personNumber }
  })
  const pool = getDatabasePool()
  const results: {
    appointment: IOfficerAppointmentsDatabaseItem
    company: ICompaniesDatabaseItem
    person: IOfficerDatabaseItem
    sic_codes: string[]
    wide_company: IWideAccountsCombinedDatabaseItem
    company_address: IDetailedPostcodesDatabaseItem
    officer_address: IDetailedPostcodesDatabaseItem
  }[] = await pool
    .query(
      `
          SELECT DISTINCT ON (c.number)
                 row_to_json(oa.*) AS appointment
               , (SELECT ARRAY_AGG(sm.description) FROM sic s JOIN sic_map sm on s.sic_code = sm.code WHERE s.company_number=c.number) AS sic_codes
               , row_to_json(c.*) AS company
               , row_to_json(po.*) AS person
               , row_to_json(wac.*) AS wide_company
               , row_to_json(dpc.*) AS company_address
               , row_to_json(dpo.*) AS officer_address
          FROM officer_appointments oa
                   JOIN companies c ON oa.company_number = c.number
                   LEFT JOIN wide_accounts_combined wac ON oa.company_number = wac.company_number
                   JOIN detailed_postcodes dpc ON c.postcode = dpc.postcode
                   JOIN person_officers po ON oa.person_number = po.person_number
                   JOIN detailed_postcodes dpo ON po.post_code = dpo.postcode
          WHERE oa.person_number = $1
          ORDER BY c.number, wac.balance_sheet_date DESC
      `,
      [personNumber]
    )
    .then(({ rows }) => rows)
    .catch(timer.postgresErrorReturn([]))
  if (!results || results?.length === 0) timer.customError('No results returned for officer by person number')
  timer.addDetail('number of appointments found', results.length)
  await pool.end()
  timer.flush()
  const officerAppointments: IOfficerAppointmentFullDetails[] = results.map((result) => ({
    appointment: convertOfficerAppointmentsDatabaseItemToItem(result.appointment),
    company: convertCompaniesDatabaseItemToItem(result.company),
    officerAddress: convertDetailPostcodesToAddress(result.officer_address, result.person.address_line_1),
    companyAddress: convertDetailPostcodesToAddress(result.company_address, result.company.streetaddress),
    sicCodes: result.sic_codes,
    companyAccounts: convertWideAccountsCombinedDatabaseItemToItem(result.wide_company)
  }))
  const output: GetOfficerAppointmentsForOfficerOutput = {
    officerAppointments
  }
  return output
}
