import { IFilterMapValue } from '../../types/IFilters'
import { filterAccountantsByName, filterAccountantsByNameMetadata } from './filters/name'
import { filterAccountantBySoftwareMetadata, filterAccountantsBySoftware } from './filters/software'
import {
  filterAccountantsByNumberOfClients,
  filterAccountantsByNumberOfClientsMetdata
} from './filters/numberOfClients'
import { filterAccountantsByLocation, filterAccountantsByLocationMetadata } from './filters/location'
import {
  filterAccountantsByClientCompanyNumber,
  filterAccountantsByClientCompanyNumberMetadata
} from './filters/clientCompanyNumber'

export const getAccountantFilterList: () => Map<string, IFilterMapValue> = () => {
  const filterMap = new Map()
  filterMap.set('name', {
    filterOption: filterAccountantsByNameMetadata,
    filter: filterAccountantsByName
  })
  filterMap.set('production software', {
    filterOption: filterAccountantBySoftwareMetadata,
    filter: filterAccountantsBySoftware
  })
  filterMap.set('number of clients', {
    filterOption: filterAccountantsByNumberOfClientsMetdata,
    filter: filterAccountantsByNumberOfClients
  })
  filterMap.set('client company number', {
    filterOption: filterAccountantsByClientCompanyNumberMetadata,
    filter: filterAccountantsByClientCompanyNumber
  })
  filterMap.set('location', {
    filterOption: filterAccountantsByLocationMetadata,
    filter: filterAccountantsByLocation
  })
  return filterMap
}

//to add a new filter:
// - create a new file in interface/filterAccountants/filters
// - write a function to perform that filter, and the metadata for the filter
// - import them in this file, and do filterMap.set('filter name', filter)
