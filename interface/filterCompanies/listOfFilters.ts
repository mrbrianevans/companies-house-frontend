import { IFilterMapValue } from '../../types/IFilters'
import { filterCompaniesByName, filterCompaniesByNameMetadata } from './filters/name'
import { filterCompaniesByLocation, filterCompaniesByLocationMetadata } from './filters/location'
import { filterCompaniesBySicCode, filterCompaniesBySicCodeMetadata } from './filters/sicCode'
import { filterCompaniesByAge, filterCompaniesByAgeMetadata } from './filters/age'
import { filterCompaniesByStatus, filterCompaniesByStatusMetadata } from './filters/status'
import {
  filterCompaniesBySicCodeDescription,
  filterCompaniesBySicCodeDescriptionMetadata
} from './filters/sicCodeDescription'

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
  filterMap.set('sic code description', {
    filterOption: filterCompaniesBySicCodeDescriptionMetadata,
    filter: filterCompaniesBySicCodeDescription
  })
  filterMap.set('age', {
    filterOption: filterCompaniesByAgeMetadata,
    filter: filterCompaniesByAge
  })
  filterMap.set('location', {
    filterOption: filterCompaniesByLocationMetadata,
    filter: filterCompaniesByLocation
  })
  filterMap.set('status', {
    filterOption: filterCompaniesByStatusMetadata,
    filter: filterCompaniesByStatus
  })
  return filterMap
}

//to add a new filter:
// - create a new file in interface/filterCompanies/filters
// - write a function to perform that filter, and the metadata for the filter
// - import them in this file, and do filterMap.set('filter name', filter)
