import { getDatabasePool } from '../helpers/connectToDatabase'
import { ICompanyProfile } from '../types/ICompany'

const getAccountantClients: (name: string) => Promise<ICompanyProfile[]> = async (name) => {
  console.time('Querying database for accountants clients')
  const pool = getDatabasePool()
  const { rows: matchingClients } = await pool.query(
    `
        SELECT DISTINCT name,
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
                        dp.parish,
                        dp.region,
                        (SELECT ARRAY_AGG(sm.description)
                         FROM sic s
                                  JOIN sic_map sm ON sm.code = s.sic_code
                         WHERE s.company_number = $1) AS sic_codes
        FROM companies c
                 JOIN wide_accounts_combined wac
                      ON c.number = wac.company_number,
             detailed_postcodes dp
        WHERE wac.accountants = $1
          AND dp.postcode = c.postcode
        ORDER BY c.name
    `,
    [name]
  )
  await pool.end()
  console.timeEnd('Querying database for accountants clients')
  return matchingClients
}

export default getAccountantClients
