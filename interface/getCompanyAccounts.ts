import { getDatabasePool } from '../helpers/connectToDatabase'
import { ICompanyAccounts } from '../types/ICompanyAccounts'

const getCompanyAccounts: (company_number: string) => Promise<ICompanyAccounts | null> = async (companyNumber) => {
  const pool = getDatabasePool()
  const { rows: accountsRows, rowCount: inWideAccounts } = await pool.query(
    `
        SELECT company_number,
               balance_sheet_date::text,
               accountants,
               accouting_software AS accounting_software,
               employees,
               current_assets,
               cash_at_bank,
               debtors,
               creditors,
               fixed_assets,
               net_assets,
               total_assets_less_current_liabilities,
               equity,
               revenue,
               profit,
               officers
        FROM wide_accounts_combined
        WHERE company_number = $1
    `,
    [companyNumber]
  )
  await pool.end()
  if (inWideAccounts) return accountsRows[0]

  return null
}

export default getCompanyAccounts
