// generated typescript definitions from database using groovy script

export interface ICompaniesDatabaseItem {
  name?: string
  number?: string
  streetaddress?: string
  county?: string
  country?: string
  postcode?: string
  category?: string
  origin?: string
  status?: string
  date?: number
  updated?: Date
  can_file?: boolean
}

export interface ICompaniesItem {
  name?: string
  companyNumber?: string
  streetAddress?: string
  county?: string
  country?: string
  postcode?: string
  category?: string
  countryOfOrigin?: string
  status?: string
  dateOfCreation?: number
  lastUpdated?: number
  canFile?: boolean
}

export function convertCompaniesDatabaseItemToItem(databaseItem: ICompaniesDatabaseItem): ICompaniesItem {
  if (!databaseItem) return null
  const item: ICompaniesItem = {
    name: databaseItem.name,
    companyNumber: databaseItem.number,
    streetAddress: databaseItem.streetaddress,
    county: databaseItem.county,
    country: databaseItem.country,
    postcode: databaseItem.postcode,
    category: databaseItem.category,
    countryOfOrigin: databaseItem.origin,
    status: databaseItem.status,
    dateOfCreation: new Date(databaseItem.date).valueOf(),
    lastUpdated: new Date(databaseItem.updated).valueOf(),
    canFile: databaseItem.can_file
  }
  return item
}
