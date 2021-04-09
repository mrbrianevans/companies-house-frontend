export interface DBFilingEvent {
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

export interface DBCompanyEvent {
  id: string
  company_number: string
  fields_changed: {}
  published: Date
  captured: Date
  event: {}
  new: boolean
  timepoint: number
}

export type FilingEvent = {
  id: string
  category: string
  description_code: string
  description_html: string
  filing_date: string
  published: string
  barcode: string
  type: string
}
export type CompanyEvent = {
  id: string
  fields_changed: { [whatChanged: string]: { new: string; old: string } }
  published: string
}
