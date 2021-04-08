import { getDatabasePool } from '../helpers/connectToDatabase'
import { ICompanyProfile } from '../types/ICompany'

export const getCompanyProfile: (company_number: string) => Promise<ICompanyProfile> = async (company_number) => {
  const pool = getDatabasePool()
  const { rows: profileFromDb } = await pool.query(
    `
        SELECT name,
               number                        as company_number,
               c.postcode,
               c.status,
               c.category,
               c.date::text                  AS date_of_creation,
               c.updated::text               AS data_updated,
               c.streetaddress,
               dp.country,
               dp.county,
               dp.built_up_area,
               dp.region,
               (SELECT ARRAY_AGG(sm.description)
                FROM sic s
                         JOIN sic_map sm ON sm.code = s.sic_code
                WHERE s.company_number = $1) AS sic_codes
        FROM companies c,
             detailed_postcodes dp
        WHERE c.number = $1
          AND dp.postcode = c.postcode `,
    [company_number]
  )
  await pool.end()
  if (profileFromDb.length) return profileFromDb[0]
  else {
    //todo: check government API here
    return 'Cannot find company. Need to check API'
  }
}
