import { IFilterOption, IFilterValue } from '../../types/IFilters'
import { FilterCategory } from '../../types/FilterCategory'
import getFilterConfig from '../getFilterConfig'

type GetFilterOptionForFilterValueParams = {
  filterValue: IFilterValue
  category: FilterCategory
}
export const getFilterOptionForFilterValue: (params: GetFilterOptionForFilterValueParams) => IFilterOption = ({
  filterValue,
  category
}) => {
  return getFilterConfig({ category }).filters.find((filter) => filter.field === filterValue.field)
}
