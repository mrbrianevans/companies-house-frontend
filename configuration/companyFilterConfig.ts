import { FilterConfig } from '../components/FilterPage/FilterPage'

export const companyFilterConfig: FilterConfig = {
  countResultsApiUrl: '/api/companies/countFilterResults',
  getFilterIdApiUrl: '/api/companies/filterRedirect',
  redirectUrl: '/company/filter/',
  labelPlural: 'companies',
  labelSingular: 'company'
}
