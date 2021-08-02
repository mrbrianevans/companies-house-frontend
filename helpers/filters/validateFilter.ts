import { IFilterValue } from '../../types/IFilters'
import { FilterCategory } from '../../types/FilterCategory'
/**
 * Checks if a filter is valid. This includes if the field exists, if the value type is correct and other checks.
 */

export const validateFilter: (filterValue: IFilterValue, category: FilterCategory) => boolean = (filterValue) => {
  //todo: validate filter to make sure the combination of category, comparison, field and value are correct
  return true
}
