import { IFilterValue } from '../../types/IFilters'
import { getFilterComparisonProperties } from './getFilterComparisonProperties'

export const translateFiltersToEnglish = (filters: IFilterValue[]) => {
  console.log('converting filters to english:', filters)
  return filters
    .map((filter) => {
      // get the filter option > dataType for each one, and respect custom formatters
      const comparator = getFilterComparisonProperties(filter.comparison).english
      return `${filter.field} ${comparator} ${filter.values.join(' or ')}`
    })
    .join(' and ')
}
