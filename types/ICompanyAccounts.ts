export interface ICompanyAccounts {
  company_number: string
  balance_sheet_date?: string
  accountants?: string
  accounting_software?: string
  employees?: number
  current_assets?: number
  cash_at_bank?: number
  debtors?: number
  creditors?: number
  fixed_assets?: number
  net_assets?: number
  total_assets_less_current_liabilities?: number
  equity?: number
  revenue?: number
  profit?: number
  officers?: string[]
}
