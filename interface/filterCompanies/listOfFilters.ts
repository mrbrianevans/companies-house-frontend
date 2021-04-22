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
import { filterCompaniesByProfit, filterCompaniesByProfitMetadata } from './filters/profit'
import { filterCompaniesByCreditors, filterCompaniesByCreditorsMetadata } from './filters/creditors'
import { filterCompaniesByCurrentAssets, filterCompaniesByCurrentAssetsMetadata } from './filters/currentAssets'
import { filterCompaniesByEmployees, filterCompaniesByEmployeesMetadata } from './filters/employees'
import { filterCompaniesByDebtors, filterCompaniesByDebtorsMetadata } from './filters/debtors'
import { filterCompaniesByCashAtBank, filterCompaniesByCashAtBankMetadata } from './filters/cashAtBank'
import { filterCompaniesByNetAssets, filterCompaniesByNetAssetsMetadata } from './filters/netAssets'

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

  // accounts
  filterMap.set('profit', {
    filterOption: filterCompaniesByProfitMetadata,
    filter: filterCompaniesByProfit
  })
  filterMap.set('employees', {
    filterOption: filterCompaniesByEmployeesMetadata,
    filter: filterCompaniesByEmployees
  })
  filterMap.set('current assets', {
    filterOption: filterCompaniesByCurrentAssetsMetadata,
    filter: filterCompaniesByCurrentAssets
  })
  filterMap.set('cash at bank', {
    filterOption: filterCompaniesByCashAtBankMetadata,
    filter: filterCompaniesByCashAtBank
  })
  filterMap.set('debtors', {
    filterOption: filterCompaniesByDebtorsMetadata,
    filter: filterCompaniesByDebtors
  })
  filterMap.set('creditors', {
    filterOption: filterCompaniesByCreditorsMetadata,
    filter: filterCompaniesByCreditors
  })
  filterMap.set('net assets', {
    filterOption: filterCompaniesByNetAssetsMetadata,
    filter: filterCompaniesByNetAssets
  })
  // Generated 7 files: 22.398ms

  return filterMap
}

//to add a new filter:
// - create a new file in interface/filterCompanies/filters
// - write a function to perform that filter, and the metadata for the filter
// - import them in this file, and do filterMap.set('filter name', filter)
