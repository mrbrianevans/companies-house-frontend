import { getDatabasePool } from '../helpers/connectToDatabase'
import { ICompanyProfile } from '../types/ICompany'
import axios from 'axios'
import { ICompaniesHouseApiCompanyProfile } from '../types/ICompaniesHouseApiCompanyProfile'
import { Timer } from '../helpers/Timer'
export const getCompanyProfile: (company_number: string) => Promise<ICompanyProfile | null> = async (
  company_number
) => {
  if (!company_number.match(/^[0-9]{6,8}|([A-Z]{2}[0-9]{6})$/)) return null
  const pool = getDatabasePool()
  const { rows: profileFromDb } = await pool.query(
    `
        SELECT name,
               number                        as company_number,
               c.postcode,
               c.status,
               c.category,
               c.date::date::text            AS date_of_creation,
               c.updated::text               AS data_updated,
               c.streetaddress,
               dp.country,
               dp.county,
               dp.built_up_area,
               dp.parish,
               dp.region,
               COALESCE((SELECT ARRAY_AGG(sm.description)
                FROM sic s
                         JOIN sic_map sm ON sm.code = s.sic_code
                WHERE s.company_number = $1), ARRAY[]::varchar[]) AS sic_codes
        FROM companies c,
             detailed_postcodes dp
        WHERE c.number = $1
          AND dp.postcode = c.postcode `,
    [company_number]
  )
  await pool.end()
  if (profileFromDb.length) {
    const company: ICompanyProfile = profileFromDb[0]
    //todo: cascading importance of different address fields should coalesce into an 'area' field
    if (company.parish.endsWith(', unparished area'))
      company.parish = company.parish.slice(0, company.parish.indexOf(', unparished area'))
    return company
  } else {
    const timer = new Timer({
      details: { companyNumber: company_number, class: 'company-profile' },
      label: 'Fetch company profile from Companies House API'
    })
    timer.start('API call')
    const apiUrl = 'https://api.company-information.service.gov.uk/company/' + company_number
    const govResponse: ICompaniesHouseApiCompanyProfile = await axios
      .get(apiUrl, {
        auth: { username: process.env.APIUSER, password: '' }
      })
      .then((res) => res.data)
    timer.flush()
    const companyData: ICompanyProfile = {
      category: govResponse.type || null,
      company_number: govResponse.company_number || null,
      country: govResponse.registered_office_address.country || null,
      county: govResponse.registered_office_address.region || null,
      data_updated: Date.now(),
      date_of_creation: govResponse.date_of_creation || null,
      name: govResponse.company_name || null,
      parish: govResponse.registered_office_address.locality || null,
      postcode: govResponse.registered_office_address.postal_code || null,
      region: govResponse.registered_office_address.region || null,
      sic_codes: govResponse.sic_codes || null,
      status: govResponse.company_status || null,
      streetaddress: govResponse.registered_office_address.address_line_1 || null
    }
    //todo: save this data in the database so that it doesn't need to be called again
    return companyData
  }
}
