import { FilterConfig } from '../components/FilterPage/FilterPage'

export const accountantFilterConfig: FilterConfig = {
  countResultsApiUrl: '/api/accountants/countFilterResults',
  getFilterIdApiUrl: '/api/accountants/filterRedirect',
  redirectUrl: '/accountants/filter/',
  labelPlural: 'accountants',
  labelSingular: 'accountant'
}
