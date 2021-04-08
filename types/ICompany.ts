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
  built_up_area: string
  streetaddress: string
  country: string
  region: string
  sic_codes: string[]
  status: string
  category: string
  date_of_creation: string
  data_updated: string
}
