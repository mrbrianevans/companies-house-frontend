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
  sicCodes?: { company_number: string, sic_code: string }[]
}
