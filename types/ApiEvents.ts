export interface ApiCompanyProfileEvent {
  resource_kind: string
  resource_uri: string
  resource_id: string
  data: {
    accounts: {
      accounting_reference_date: {}
      last_accounts: {}
      next_accounts: {}
      next_due: string
      next_made_up_to: string
    }
    can_file: boolean
    company_name: string
    company_number: string
    company_status: string
    confirmation_statement: { next_due: string; next_made_up_to: string }
    date_of_creation: string
    etag: string
    jurisdiction: string
    links: {
      filing_history: string
      officers: string
      persons_with_significant_control: string
      self: string
    }
    registered_office_address: {
      address_line_1: string
      address_line_2: string
      country: string
      locality: string
      postal_code: string
    }
    sic_codes: [string]
    type: string
  }
  event: {
    timepoint: number
    published_at: string
    type: string
  }
}

declare module ApiFilingEvent {
  export interface Annotation {
    annotation: string
    date: string
    description: string
  }

  export interface AssociatedFiling {
    date: string
    description: string
    type: string
  }

  export interface Links {
    document_metadata: string
    self: string
  }

  export interface Resolution {
    category: string
    description: string
    document_id: string
    receive_date: string
    subcategory: string
    type: string
  }

  export interface Data {
    annotations: Annotation[]
    associated_filings: AssociatedFiling[]
    barcode: string
    category: string
    date: string
    description: string
    links: Links
    pages: number
    paper_filed: boolean
    resolutions: Resolution[]
    subcategory: string
    transaction_id: string
    type: string
  }

  export interface Event {
    fields_changed: string[]
    published_at: string
    timepoint: number
    type: string
  }

  export interface ApiFilingEvent {
    data: Data
    event: Event
    resource_id: string
    resource_kind: string
    resource_uri: string
  }
}

declare module ApiInsolvencyEvent {
  export interface Date {
    date: string
    type: string
  }

  export interface Links {
    charge: string
  }

  export interface Address {
    address_line_1: string
    address_line_2: string
    country: string
    locality: string
    postal_code: string
    region: string
  }

  export interface Practitioner {
    address: Address[]
    appointed_on: string
    ceased_to_act_on: string
    name: string
    role: string
  }

  export interface Case {
    dates: Date[]
    links: Links
    notes: string[]
    number: number
    practitioners: Practitioner[]
    type: string
  }

  export interface Data {
    cases: Case[]
    etag: string
    status: string
  }

  export interface Event {
    fields_changed: string[]
    published_at: string
    timepoint: number
    type: string
  }

  export interface ApiInsolvencyEvent {
    data: Data
    event: Event
    resource_id: string
    resource_kind: string
    resource_uri: string
  }
}

declare module ApiChargesEvent {
  export interface Classification {
    description: string
    type: string
  }

  export interface Link {
    case: string
  }

  export interface InsolvencyCas {
    case_number: number
    links: Link[]
    transaction_id: number
  }

  export interface Link2 {
    self: string
  }

  export interface Particular {
    chargor_acting_as_bare_trustee: boolean
    contains_fixed_charge: boolean
    contains_floating_charge: boolean
    contains_negative_pledge: boolean
    description: string
    floating_charge_covers_all: boolean
    type: string
  }

  export interface PersonsEntitled {
    name: string
  }

  export interface ScottishAlteration {
    description: string
    has_alterations_to_order: boolean
    has_alterations_to_prohibitions: boolean
    has_alterations_to_provisions: boolean
    type: string
  }

  export interface SecuredDetail {
    description: string
    type: string
  }

  export interface Link3 {
    filing: string
    insolvency_case: string
  }

  export interface Transaction {
    delivered_on: string
    filing_type: string
    insolvency_case_number: number
    links: Link3[]
    transaction_id: number
  }

  export interface Data {
    acquired_on: string
    assests_ceased_released: string
    charge_code: string
    charge_number: number
    classification: Classification[]
    covering_instrument_date: string
    created_on: string
    delivered_on: string
    etag: string
    id: string
    insolvency_cases: InsolvencyCas[]
    links: Link2[]
    more_than_four_persons_entitled: boolean
    particulars: Particular[]
    persons_entitled: PersonsEntitled[]
    resolved_on: string
    satisfied_on: string
    scottish_alterations: ScottishAlteration[]
    secured_details: SecuredDetail[]
    status: string
    transactions: Transaction[]
  }

  export interface Event {
    fields_changed: string[]
    published_at: string
    timepoint: number
    type: string
  }

  export interface ApiChargesEvent {
    data: Data
    event: Event
    resource_id: string
    resource_kind: string
    resource_uri: string
  }
}

declare module ApiPscEvent {
  export interface Address {
    address_line_1: string
    address_line_2: string
    care_of: string
    country: string
    locality: string
    po_box: string
    postal_code: string
    premises: string
    region: string
  }

  export interface DateOfBirth {
    day: number
    month: number
    year: number
  }

  export interface Identification {
    country_registered: string
    legal_authority: string
    legal_form: string
    place_registered: string
    registration_number: string
  }

  export interface Links {
    self: string
    statement: string
  }

  export interface NameElements {
    forename: string
    other_forenames: string
    surname: string
    title: string
  }

  export interface Data {
    address: Address
    ceased: boolean
    ceased_on: string
    country_of_residence: string
    date_of_birth: DateOfBirth
    description: string
    etag: string
    identification: Identification
    kind: string
    links: Links
    name: string
    name_elements: NameElements
    nationality: string
    natures_of_control: string[]
    notified_on: string
  }

  export interface Event {
    fields_changed: string[]
    published_at: string
    timepoint: number
    type: string
  }

  export interface ApiPscEvent {
    data: Data
    event: Event
    resource_id: string
    resource_kind: string
    resource_uri: string
  }
}
