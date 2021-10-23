import { getDatabasePool } from '../../helpers/sql/connectToDatabase'
import { ICompanyFullDetails } from '../../types/ICompany'
import axios from 'axios'
import { ICompaniesHouseApiCompanyProfile } from '../../types/ICompaniesHouseApiCompanyProfile'
import { Timer } from '../../helpers/Timer'
import {
  convertWideAccountsCombinedDatabaseItemToItem,
  IWideAccountsCombinedDatabaseItem
} from '../../types/IWideAccountsCombined'
import { convertCompaniesDatabaseItemToItem, ICompaniesDatabaseItem } from '../../types/ICompanies'
import { convertDetailPostcodesToAddress, IDetailedPostcodesDatabaseItem } from '../../types/IDetailedPostcodes'
import { convertSicCodeDatabaseItemToItem, ISicCodeDatabaseItem } from '../../types/ISicCode'
import { prettyPrintSqlQuery } from '../../helpers/sql/prettyPrintSqlQuery'
import { getCompaniesHouseRateLimit } from '../../helpers/companiesHouseRateLimit'

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
    .catch((e) => timer.postgresErrorReturn(false)(e))
  existanceCheckTimer.stop()
  timer.addDetail('company exists in database', exists)
  if (!exists) {
    timer.start('setCompanyDetailsFromApi')
    await setCompanyDetailsFromApi(company_number)
    timer.stop('setCompanyDetailsFromApi')
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
    .catch((e) => timer.postgresError(e))
  await pool.end()
  if (!profileFromDb) timer.customError("Still can't find company after calling government API and inserting to db")
  const company: ICompanyFullDetails = profileFromDb
    ? {
        company: convertCompaniesDatabaseItemToItem(profileFromDb.company),
        accounts: convertWideAccountsCombinedDatabaseItemToItem(profileFromDb.wide_company),
        address: convertDetailPostcodesToAddress(profileFromDb.detailed_postcode, profileFromDb.company.streetaddress),
        sicCodes: profileFromDb.sic_codes?.map((sicCode) => convertSicCodeDatabaseItemToItem(sicCode)) ?? []
      }
    : null
  timer.flush()
  return company
}
/**
 * Gets a companies details from the government API and updates them in the companies and sic tables, returning rate limit
 * @param companyNumber the company number to update
 */
export const setCompanyDetailsFromApi = async (companyNumber: string) => {
  const timer = new Timer({
    details: { companyNumber },
    label: 'Set company profile details from government API',
    filename: '/interface/getCompanyProfile.ts'
  })
  const pool = getDatabasePool()
  timer.start('API call')
  const apiUrl = 'https://api.company-information.service.gov.uk/company/' + companyNumber
  let rateLimit
  const gr: ICompaniesHouseApiCompanyProfile = await axios
    .get(apiUrl, {
      auth: { username: process.env.APIUSER, password: '' }
    })
    .then((res) => {
      rateLimit = getCompaniesHouseRateLimit(res.headers)
      return res.data
    })
    .catch(timer.genericErrorCustomMessage('Error calling government API for company profile'))
  timer.end()
  if (gr) {
    const insertCompanyFromApiTimer = timer.start('Insert company into database with details from government API')
    const insertCompany = pool.query(
      `
    INSERT INTO companies (name, number, streetaddress, county, country, postcode, category, origin, status, date, updated, can_file) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, default, $11) 
    ON CONFLICT ON CONSTRAINT companies_pkey 
        DO UPDATE SET name=COALESCE(excluded.name, companies.name), streetaddress=COALESCE(excluded.streetaddress,companies.streetaddress),
                      country=COALESCE(excluded.country, companies.country),
                      county=COALESCE(excluded.county,companies.county), postcode=COALESCE(excluded.postcode,companies.postcode), category=COALESCE(excluded.category, companies.category),
                      origin=COALESCE(excluded.origin, companies.origin), status=COALESCE(excluded.status,companies.status),date=COALESCE(excluded.date, companies.date),
                      updated=default, can_file=COALESCE(excluded.can_file,companies.can_file)

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
    const insertSicCodes =
      gr.sic_codes?.map((code) =>
        pool.query(`INSERT INTO sic (company_number, sic_code) VALUES ($1, $2)`, [companyNumber, code])
      ) ?? []
    await Promise.all([insertCompany, ...insertSicCodes]).catch((e) => timer.postgresError(e))
    insertCompanyFromApiTimer.stop()
  } else {
    timer.customError('Could not find company on government API. Company number=' + companyNumber)
  }
  await pool.end()
  timer.flush()
  return rateLimit
}
