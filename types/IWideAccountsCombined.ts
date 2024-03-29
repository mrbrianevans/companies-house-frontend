// generated typescript definitions from database using groovy script

export interface IWideAccountsCombinedDatabaseItem {
  company_number?: string
  balance_sheet_date?: Date
  accountants?: string
  accouting_software?: string
  employees?: unknown
  current_assets?: unknown
  cash_at_bank?: unknown
  debtors?: unknown
  creditors?: unknown
  fixed_assets?: unknown
  net_assets?: unknown
  total_assets_less_current_liabilities?: unknown
  equity?: unknown
  revenue?: unknown
  profit?: unknown
  officers?: string[]
}

export interface IWideAccountsCombinedItem {
  companyNumber?: string
  balanceSheetDate?: Date
  accountants?: string
  accountingSoftware?: string
  employees?: unknown
  currentAssets?: unknown
  cashAtBank?: unknown
  debtors?: unknown
  creditors?: unknown
  fixedAssets?: unknown
  netAssets?: unknown
  totalAssetsLessCurrentLiabilities?: unknown
  equity?: unknown
  revenue?: unknown
  profit?: unknown
  officers?: string[]
}

export function convertWideAccountsCombinedDatabaseItemToItem(
  databaseItem: IWideAccountsCombinedDatabaseItem
): IWideAccountsCombinedItem {
  if (!databaseItem) return null
  const item: IWideAccountsCombinedItem = {
    companyNumber: databaseItem.company_number,
    balanceSheetDate: databaseItem.balance_sheet_date,
    accountants: databaseItem.accountants,
    accountingSoftware: databaseItem.accouting_software,
    employees: databaseItem.employees,
    currentAssets: databaseItem.current_assets,
    cashAtBank: databaseItem.cash_at_bank,
    debtors: databaseItem.debtors,
    creditors: databaseItem.creditors,
    fixedAssets: databaseItem.fixed_assets,
    netAssets: databaseItem.net_assets,
    totalAssetsLessCurrentLiabilities: databaseItem.total_assets_less_current_liabilities,
    equity: databaseItem.equity,
    revenue: databaseItem.revenue,
    profit: databaseItem.profit,
    officers: databaseItem.officers
  }
  return item
}
