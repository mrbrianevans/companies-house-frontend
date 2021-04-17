import { IAccountant } from '../types/IAccountant'
import { getDatabasePool } from '../helpers/connectToDatabase'

const getAccountantProfile: (name: string) => Promise<IAccountant | null> = async (name) => {
  console.time('Query database for accountant profile')
  const pool = getDatabasePool()
  const { rows: matchingAccountants, rowCount: foundMatchingAccountants } = await pool.query(
    `
        SELECT name_on_accounts, company_number, software, number_of_clients
        FROM accountants
        WHERE name_on_accounts = $1
    `,
    [name]
  )
  await pool.end()
  console.timeEnd('Query database for accountant profile')
  if (foundMatchingAccountants) return matchingAccountants[0]
  return null
}

export default getAccountantProfile
