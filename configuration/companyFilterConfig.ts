import { IFilterConfig } from '../types/IFilterConfig'
import { companyFilters } from './filters/companyFilters'

export const companyFilterConfig: IFilterConfig = {
  urlPath: 'company',
  viewItemUrl: '/company/',
  labelPlural: 'companies',
  labelSingular: 'company',
  main_table: 'company_view',
  operation_code: 'download_company_records',
  uniqueIdentifier: 'company_number',
  filters: companyFilters
}
