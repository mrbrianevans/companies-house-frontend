import { IFilterConfig } from '../types/IFilterConfig'
import { FilterComparison } from './filterComparisons'
import { FilterDatatype } from './filterDatatypes'

export const companyFilterConfig: IFilterConfig = {
  urlPath: 'company',
  viewItemUrl: '/company/',
  labelPlural: 'companies',
  labelSingular: 'company',
  main_table: 'company_view',
  operation_code: 'download_company_records',
  uniqueIdentifier: 'company_number',
  filters: [
    {
      columnName: 'name',
      dataType: FilterDatatype.string,
      field: 'name',
      possibleComparisons: [FilterComparison.CONTAINS]
    }
  ]
}
