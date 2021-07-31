import { IFilterConfig } from '../types/IFilterConfig'
import { companyFilterConfig } from './companyFilterConfig'
import { accountantFilterConfig } from './accountantFilterConfig'
import { FilterCategory } from '../types/FilterCategory'
import { officerFilterConfig } from './officerFilterConfig'

export const filterConfigs: { [category: string]: IFilterConfig } = {
  [FilterCategory.COMPANY]: companyFilterConfig,
  [FilterCategory.ACCOUNTANT]: accountantFilterConfig,
  [FilterCategory.OFFICER]: officerFilterConfig
}
