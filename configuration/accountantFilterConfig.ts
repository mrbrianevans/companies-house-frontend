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
  countResultsApiUrl: '/api/filter/countResults',
  getFilterIdApiUrl: '/api/filter/getFilterId',
  redirectUrl: '/accountants/filter/',
  labelPlural: 'accountants',
  labelSingular: 'accountant',
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
  ],
  main_table: 'accountants',
  uniqueIdentifier: 'name_on_accounts'
}
