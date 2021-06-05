import { IFilterConfig } from '../types/IFilterConfig'
import { filterCompaniesByAge, filterCompaniesByAgeMetadata } from '../interface/filterCompanies/filters/age'
import { ICompanyProfile } from '../types/ICompany'

export const companyFilterConfig: IFilterConfig = {
  countResultsApiUrl: '/api/companies/countFilterResults',
  getFilterIdApiUrl: '/api/companies/filterRedirect',
  redirectUrl: '/company/filter/',
  labelPlural: 'companies',
  labelSingular: 'company',
  filters: [{ filterOption: filterCompaniesByAgeMetadata, sqlGenerator: filterCompaniesByAge }],
  main_table: 'wide_accounts_combined',
  uniqueIdentifier: 'company_number'
}
