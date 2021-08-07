import { getDatabasePool } from '../helpers/connectToDatabase'
import { ICompanyFullDetails, ICompanyProfile } from '../types/ICompany'
import axios from 'axios'
import { ICompaniesHouseApiCompanyProfile } from '../types/ICompaniesHouseApiCompanyProfile'
import { Timer } from '../helpers/Timer'
import {
  convertWideAccountsCombinedDatabaseItemToItem,
  IWideAccountsCombinedDatabaseItem
} from '../types/IWideAccountsCombined'
import { convertCompaniesDatabaseItemToItem, ICompaniesDatabaseItem } from '../types/ICompanies'
import { convertDetailPostcodesToAddress, IDetailedPostcodesDatabaseItem } from '../types/IDetailedPostcodes'
import { convertSicCodeDatabaseItemToItem, ISicCodeDatabaseItem, ISicCodeItem } from '../types/ISicCode'
export const getCompanyProfile: (company_number: string) => Promise<ICompanyFullDetails | null> = async (
  company_number
) => {
  if (!company_number.match(/^[0-9]{6,8}|([A-Z]{2}[0-9]{6})$/)) return null
  const timer = new Timer({
    details: { companyNumber: company_number },
    label: 'Get company profile by company number',
    filename: '/interface/getCompanyProfile.ts'
  })
  const pool = getDatabasePool()
  const existanceCheckTimer = timer.start('check if company exists in database')
  const exists = await pool
    .query(`SELECT * FROM companies WHERE number = $1`, [company_number])
    .then(({ rows }) => rows.length > 0)
    .catch(timer.postgresErrorReturn(false))
  existanceCheckTimer.stop()
  if (!exists) {
    timer.start('API call')
    const apiUrl = 'https://api.company-information.service.gov.uk/company/' + company_number
    const gr: ICompaniesHouseApiCompanyProfile = await axios
      .get(apiUrl, {
        auth: { username: process.env.APIUSER, password: '' }
      })
      .then((res) => res.data)
      .catch(timer.genericErrorCustomMessage('Error calling government API for company profile'))
    timer.end()
    const insertCompanyFromApiTimer = timer.start('Insert company into database with details from government API')
    await pool.query(
      `
    INSERT INTO companies (name, number, streetaddress, county, country, postcode, category, origin, status, date, can_file) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, default, $11)
    `,
      [
        gr.company_name,
        gr.company_number,
        gr.registered_office_address?.address_line_1,
        gr.registered_office_address?.locality,
        gr.registered_office_address.country,
        gr.registered_office_address.postal_code,
        gr.type,
        null,
        gr.company_status,
        gr.date_of_creation,
        gr.can_file
      ]
    )
    insertCompanyFromApiTimer.stop()
  }
  const profileFromDb: {
    company: ICompaniesDatabaseItem
    wide_company?: IWideAccountsCombinedDatabaseItem
    detailed_postcode?: IDetailedPostcodesDatabaseItem
    sic_codes: ISicCodeDatabaseItem[]
  } | null = await pool
    .query(
      `
       SELECT DISTINCT ON (c.number)  row_to_json(c.*) AS company,
                                      row_to_json(dp.*) AS detailed_postcode,
                                      row_to_json(wac.*) AS wide_company,
                                      (
                                          SELECT ARRAY_AGG(row_to_json(sm.*)) 
                                          FROM sic s JOIN sic_map sm on s.sic_code = sm.code 
                                          WHERE s.company_number=c.number
                                      ) AS sic_codes
        FROM companies c
                 LEFT JOIN wide_accounts_combined wac ON c.number = wac.company_number
                 LEFT JOIN detailed_postcodes dp ON c.postcode::text = dp.postcode
        WHERE c.number = $1
        ORDER BY c.number, wac.balance_sheet_date DESC;`,
      [company_number]
    )
    .then(({ rows }) => rows[0])
    .catch(timer.postgresError)
  await pool.end()
  if (!profileFromDb) timer.customError("Still can't find company after calling government API and inserting to db")
  const company: ICompanyFullDetails = profileFromDb
    ? {
        company: convertCompaniesDatabaseItemToItem(profileFromDb.company),
        accounts: convertWideAccountsCombinedDatabaseItemToItem(profileFromDb.wide_company),
        address: convertDetailPostcodesToAddress(profileFromDb.detailed_postcode, profileFromDb.company.streetaddress),
        sicCodes: profileFromDb.sic_codes.map((sicCode) => convertSicCodeDatabaseItemToItem(sicCode))
      }
    : null
  timer.flush()
  console.log('output of get company profile:')
  console.log(company)
  return company
}
