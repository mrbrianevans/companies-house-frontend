import { IAccountant } from '../types/IAccountant'
import { getDatabasePool } from '../helpers/connectToDatabase'
import { Timer } from '../helpers/Timer'

const getAccountantProfile: (name: string) => Promise<IAccountant | null> = async (name) => {
  const timer = new Timer({ label: 'Get accountant profile from DB', details: { class: 'get-accountant-profile' } })
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
  timer.flush()
  if (foundMatchingAccountants) return matchingAccountants[0]
  return null
}

export default getAccountantProfile
