import { IFilterConfig } from '../types/IFilterConfig'
import { companyFilterConfig } from './companyFilterConfig'
import { accountantFilterConfig } from './accountantFilterConfig'
import { FilterCategory } from '../types/FilterCategory'
import { officerFilterConfig } from './officerFilterConfig'

export const filterConfigs: { [category: string]: IFilterConfig } = Object.freeze({
  [FilterCategory.COMPANY]: companyFilterConfig,
  [FilterCategory.ACCOUNTANT]: accountantFilterConfig,
  [FilterCategory.OFFICER]: officerFilterConfig
})

export const FilterConfigMap = new Map<FilterCategory, IFilterConfig>(
  Object.entries(filterConfigs) as [FilterCategory, IFilterConfig][]
)
