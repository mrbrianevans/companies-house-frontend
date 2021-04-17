import { IFilterMapValue } from '../../types/IFilters'
import { filterCompaniesByName, filterCompaniesByNameMetadata } from './filters/name'
import { filterCompaniesByLocation, filterCompaniesByLocationMetadata } from './filters/location'
import { filterCompaniesBySicCode, filterCompaniesBySicCodeMetadata } from './filters/sicCode'

export const getCompanyFilterList: () => Map<string, IFilterMapValue> = () => {
  const filterMap = new Map()
  filterMap.set('name', {
    filterOption: filterCompaniesByNameMetadata,
    filter: filterCompaniesByName
  })
  filterMap.set('sic code', {
    filterOption: filterCompaniesBySicCodeMetadata,
    filter: filterCompaniesBySicCode
  })
  // filterMap.set('date of establishment', {
  //   filterOption: filterAccountantsByNumberOfClientsMetdata,
  //   filter: filterAccountantsByNumberOfClients
  // })
  filterMap.set('location', {
    filterOption: filterCompaniesByLocationMetadata,
    filter: filterCompaniesByLocation
  })
  // filterMap.set('revenue', { filterOption: filterAccountantsByLocationMetadata, filter: filterAccountantsByLocation })
  // filterMap.set('profit', { filterOption: filterAccountantsByLocationMetadata, filter: filterAccountantsByLocation })
  // filterMap.set('employees', { filterOption: filterAccountantsByLocationMetadata, filter: filterAccountantsByLocation })
  return filterMap
}

//to add a new filter:
// - create a new file in interface/filterCompanies/filters
// - write a function to perform that filter, and the metadata for the filter
// - import them in this file, and do filterMap.set('filter name', filter)
