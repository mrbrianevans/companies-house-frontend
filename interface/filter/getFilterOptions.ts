import { IFilterOption } from '../../types/IFilters'
import { FilterCategory } from '../../types/FilterCategory'
import getFilterConfig from '../../helpers/getFilterConfig'

type GetFilterOptionsParams = {
  category: FilterCategory
}
/**
 * returns a list of filters that a user can use for a given result set
 */
const getFilterOptions: (params: GetFilterOptionsParams) => IFilterOption[] = ({ category }) => {
  const config = getFilterConfig({ category })
  return config.filters
}
export default getFilterOptions
