import { IAccountant } from '../../types/IAccountant'
import { getDatabasePool } from '../../helpers/connectToDatabase'
import { Timer } from '../../helpers/Timer'

/**
 * Gets an accountants profile from the database by its name
 * @param name the exact name of the accountant (as it appears on accounts)
 *
 * @return IAccountant accountant profile if found, otherwise null
 */
const getAccountantProfile: (name: string) => Promise<IAccountant | null> = async (name) => {
  const timer = new Timer({
    label: 'Get accountant profile from DB',
    details: { class: 'get-accountant-profile', name },
    filename: '/interface/getAccountantProfile.ts'
  })
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
  timer.addDetail('number of matching accountants', matchingAccountants.length)
  timer.flush()
  if (foundMatchingAccountants) return matchingAccountants[0]
  return null
}

export default getAccountantProfile
