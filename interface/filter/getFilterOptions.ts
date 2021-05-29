/**
 * returns a list of filters that a user can use for a given result set
 */
import { IFilterOption } from '../../types/IFilters'
import { FilterCategory } from '../../types/FilterCategory'
import getFilterConfig from '../../helpers/getFilterConfig'
type GetFilterOptionsParams = {
  category: FilterCategory
}
const getFilterOptions: (params: GetFilterOptionsParams) => IFilterOption[] = ({ category }) => {
  const config = getFilterConfig({ category })
  const filters = config.filters
  const filterOptions = filters.map((filter) => filter.filterOption)
  return filterOptions
}
