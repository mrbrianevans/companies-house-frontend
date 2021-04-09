import { IAccountant } from '../types/IAccountant'
import { getDatabasePool } from '../helpers/connectToDatabase'

const getAccountantProfile: (name: string) => Promise<IAccountant | null> = async (name) => {
  const pool = getDatabasePool()
  const { rows: matchingAccountants, rowCount: foundMatchingAccountants } = await pool.query(
    `
        SELECT name, company_number, software, number_of_clients
        FROM legacy_accountants
        WHERE name = $1
    `,
    [name]
  )
  if (foundMatchingAccountants) return matchingAccountants[0]
  return null
}

export default getAccountantProfile
