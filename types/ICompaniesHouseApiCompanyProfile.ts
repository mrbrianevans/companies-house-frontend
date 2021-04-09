export interface ICompaniesHouseApiCompanyProfile {
  accounts: {
    accounting_reference_date: {
      day: number
      month: number
    }
    last_accounts: {
      made_up_to: string
      type: {}
    }
    next_due: string
    next_made_up_to: string
    overdue: boolean
  }
  annual_return: {
    last_made_up_to: string
    next_due: string
    next_made_up_to: string
    overdue: boolean
  }
  branch_company_details: {
    business_activity: string
    parent_company_name: string
    parent_company_number: string
  }
  can_file: boolean
  company_name: string
  company_number: string
  company_status: string
  company_status_detail: string
  confirmation_statement: {
    last_made_up_to: string
    next_due: string
    next_made_up_to: string
    overdue: boolean
  }
  date_of_cessation: string
  date_of_creation: string
  etag: string
  foreign_company_details: {
    accounting_requirement: {
      foreign_account_type: string
      terms_of_account_publication: string
    }
    accounts: {
      account_period_from: {
        day: number
        month: number
      }
      account_period_to: {
        day: number
        month: number
      }
      must_file_within: {
        months: number
      }
    }
    business_activity: string
    company_type: string
    governed_by: string
    is_a_credit_finance_institution: boolean
    originating_registry: {
      country: string
      name: string
    }
    registration_number: string
  }
  has_been_liquidated: boolean
  has_charges: boolean
  has_insolvency_history: boolean
  is_community_interest_company: boolean
  jurisdiction: string
  last_full_members_list_date: string
  links: {
    persons_with_significant_control: string
    persons_with_significant_control_statements: string
    registers: string
    self: string
  }
  previous_company_names: {
    ceased_on: string
    effective_from: string
    name: string
  }[]
  registered_office_address: {
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
  registered_office_is_in_dispute: boolean
  sic_codes: string[]
  type: string
  undeliverable_registered_office_address: boolean
}
