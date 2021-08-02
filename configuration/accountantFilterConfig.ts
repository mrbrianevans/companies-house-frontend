import { IFilterConfig } from '../types/IFilterConfig'
import { FilterComparison } from './filterComparisons'
import { FilterDatatype } from './filterDatatypes'

export const accountantFilterConfig: IFilterConfig = {
  urlPath: 'accountants',
  viewItemUrl: '/accountants/',
  labelPlural: 'accountants',
  labelSingular: 'accountant',
  operation_code: 'download_accountant_records',
  main_table: 'accountant_view',
  uniqueIdentifier: 'name_on_accounts',
  filters: [
    {
      field: 'name',
      columnName: 'name_on_accounts',
      possibleComparisons: [FilterComparison.CONTAINS],
      dataType: FilterDatatype.string
    }
  ]
}
