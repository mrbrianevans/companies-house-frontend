export interface IFilingEvent {
  id: string
  category: string
  description_code: string
  description: string
  filing_date: Date
  timepoint: number
  published: Date
  captured: Date
  barcode: string
  type: string
  company_number: string
}

export interface ICompanyEvent {
  id: string
  company_number: string
  fields_changed: {}
  published: Date
  captured: Date
  event: {}
  new: boolean
  timepoint: number
}
