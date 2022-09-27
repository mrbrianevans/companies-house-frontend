// generated typescript definitions from database using groovy script

export interface ICompanyViewDatabaseItem {
  company_number?: string
  name?: string
  streetaddress?: string
  county?: string
  area?: string
  country?: string
  postcode?: string
  company_type?: string
  country_of_origin?: string
  status?: string
  date_of_creation?: string
  balance_sheet_date?: string
  accountants?: string
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

export interface ICompanyViewItem {
  companyNumber?: string
  name?: string
  streetaddress?: string
  county?: string
  area?: string
  country?: string
  postcode?: string
  companyType?: string
  countryOfOrigin?: string
  status?: string
  dateOfCreation?: string
  balanceSheetDate?: string
  accountants?: string
  employees?: number
  currentAssets?: number
  cashAtBank?: number
  debtors?: number
  creditors?: number
  fixedAssets?: number
  netAssets?: number
  totalAssetsLessCurrentLiabilities?: number
  equity?: number
  revenue?: number
  profit?: number
  officers?: string[]
}

export function convertCompanyViewDatabaseItemToItem(databaseItem: ICompanyViewDatabaseItem): ICompanyViewItem {
  const item: ICompanyViewItem = {
    companyNumber: databaseItem.company_number,
    name: databaseItem.name,
    streetaddress: databaseItem.streetaddress,
    county: databaseItem.county,
    area: databaseItem.area,
    country: databaseItem.country,
    postcode: databaseItem.postcode,
    companyType: databaseItem.company_type,
    countryOfOrigin: databaseItem.country_of_origin,
    status: databaseItem.status,
    dateOfCreation: databaseItem.date_of_creation,
    balanceSheetDate: databaseItem.balance_sheet_date,
    accountants: databaseItem.accountants,
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
