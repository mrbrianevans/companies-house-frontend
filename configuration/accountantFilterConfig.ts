import { IFilterConfig } from '../types/IFilterConfig'
import {
  filterAccountantBySoftwareMetadata,
  filterAccountantsBySoftware
} from '../interface/filterAccountants/filters/software'
import { filterAccountantsByName, filterAccountantsByNameMetadata } from '../interface/filterAccountants/filters/name'
import {
  filterAccountantsByLocation,
  filterAccountantsByLocationMetadata
} from '../interface/filterAccountants/filters/location'
import {
  filterAccountantsByNumberOfClients,
  filterAccountantsByNumberOfClientsMetdata
} from '../interface/filterAccountants/filters/numberOfClients'

export const accountantFilterConfig: IFilterConfig = {
  urlPath: 'accountants',
  redirectUrl: '/accountants/filter/',
  viewItemUrl: '/accountants/',
  labelPlural: 'accountants',
  labelSingular: 'accountant',
  operation_code: 'download_accountant_records',
  main_table: 'accountant_view',
  uniqueIdentifier: 'name_on_accounts',
  filters: [
    { filterOption: filterAccountantBySoftwareMetadata, sqlGenerator: filterAccountantsBySoftware },
    {
      filterOption: filterAccountantsByNameMetadata,
      sqlGenerator: filterAccountantsByName
    },
    {
      filterOption: filterAccountantsByLocationMetadata,
      sqlGenerator: filterAccountantsByLocation
    },
    {
      filterOption: filterAccountantsByNumberOfClientsMetdata,
      sqlGenerator: filterAccountantsByNumberOfClients
    }
  ]
}
