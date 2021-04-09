export interface ICompaniesHouseSearchApiResponse {
  etag?: string
  items: {
    address: {
      address_line_1?: string
      address_line_2?: string
      care_of?: string
      care_of_name?: string
      country?: string
      locality?: string
      po_box?: string
      postal_code: string
      region?: string
      premises: string
    }
    address_snippet: string
    company_number: string
    external_registration_number?: string
    company_status: string
    company_type: string
    date_of_cessation?: string
    date_of_creation: string
    description: string
    description_identifier: string[]
    kind: string
    links: {
      self: string
    }
    matches: {
      address_snippet?: number[]
      snippet: number[]
      title?: number[]
    }
    snippet: string
    title: string
  }[]
  items_per_page: number
  kind: string
  start_index: number
  total_results: number
  page_number: number
}
