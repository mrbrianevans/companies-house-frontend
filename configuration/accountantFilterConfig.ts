import { IFilterConfig } from '../types/IFilterConfig'

export const accountantFilterConfig: IFilterConfig = {
  urlPath: 'accountants',
  viewItemUrl: '/accountants/',
  labelPlural: 'accountants',
  labelSingular: 'accountant',
  operation_code: 'download_accountant_records',
  main_table: 'accountant_view',
  uniqueIdentifier: 'name_on_accounts',
  filters: []
}
