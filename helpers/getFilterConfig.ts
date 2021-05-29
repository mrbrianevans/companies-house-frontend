import { FilterCategory } from '../types/FilterCategory'
import { IFilterConfig } from '../types/IFilterConfig'
import { filterConfigs } from '../configuration/filterConfigs'

type GetFilterConfigParams = {
  category: FilterCategory
}

const getFilterConfig: (params: GetFilterConfigParams) => IFilterConfig = ({ category }) => {
  return filterConfigs[category]
}

export default getFilterConfig
