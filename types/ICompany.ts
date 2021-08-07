import { ICompaniesDatabaseItem, ICompaniesItem } from './ICompanies'
import { IWideAccountsCombinedDatabaseItem, IWideAccountsCombinedItem } from './IWideAccountsCombined'
import { IDetailedPostcodesDatabaseItem, IDetailedPostcodesItem } from './IDetailedPostcodes'
import { ISicCodeItem } from './ISicCode'
import { IAddress } from './IAddress'

export interface ICompany {
  name: string
  number: string
  streetAddress: string
  county: string
  country: string
  postCode: string
  category: string
  origin: string
  status: string
  date: Date | string
  SicCode1?: string | null
  SicCode2?: string | null
  SicCode3?: string | null
  SicCode4?: string | null
  sicCodes?: { company_number: string; sic_code: string }[]
}

export interface ICompanyProfile {
  name: string
  company_number: string
  postcode: string
  county: string
  built_up_area?: string
  parish: string
  streetaddress: string
  country: string
  region: string
  sic_codes: string[]
  status: string
  category: string
  date_of_creation: string
  data_updated: number
}

/**
 * This is a newer type of company profile, with keys for different "parts" of the details such as address and accounts.
 * todo: add officers to this type as well as an array of OfficersWithAddress[]
 */
export interface ICompanyFullDetails {
  company: ICompaniesItem
  accounts?: IWideAccountsCombinedItem
  address: IAddress
  sicCodes: ISicCodeItem[]
}
