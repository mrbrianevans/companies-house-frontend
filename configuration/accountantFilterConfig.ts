import { IFilterConfig } from '../types/IFilterConfig'
import {
  filterAccountantBySoftwareMetadata,
  filterAccountantsBySoftware
} from '../interface/filterAccountants/filters/software'


export const accountantFilterConfig: IFilterConfig = {
  countResultsApiUrl: '/api/accountants/countFilterResults',
  getFilterIdApiUrl: '/api/accountants/filterRedirect',
  redirectUrl: '/accountants/filter/',
  labelPlural: 'accountants',
  labelSingular: 'accountant',
  filters: [{filterOption: filterAccountantBySoftwareMetadata, sqlGenerator: filterAccountantsBySoftware}]
}
