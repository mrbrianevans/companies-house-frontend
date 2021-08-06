// generated typescript definitions from database using groovy script
import { FilterCategory } from './FilterCategory'

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
  can_file?: unknown
}

export interface ICompaniesItem {
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
  canFile?: unknown
}

export function convertCompaniesDatabaseItemToItem(databaseItem: ICompaniesDatabaseItem): ICompaniesItem {
  const item = {
    name: databaseItem.name,
    number: databaseItem.number,
    streetaddress: databaseItem.streetaddress,
    county: databaseItem.county,
    country: databaseItem.country,
    postcode: databaseItem.postcode,
    category: databaseItem.category,
    origin: databaseItem.origin,
    status: databaseItem.status,
    date: databaseItem.date,
    updated: databaseItem.updated,
    canFile: databaseItem.can_file
  }
  return item
}
