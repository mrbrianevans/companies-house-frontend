import { IFilterOption, IFilterValue } from '../../types/IFilters'
import { getFilterComparisonProperties } from './getFilterComparisonProperties'
import { FilterComparison } from '../../configuration/filterComparisons'
import { FilterDatatype } from '../../configuration/filterDatatypes'

export const translateFiltersToEnglish = (filters: IFilterValue[]) => {
  return filters
    .map((filter) => {
      // get the filter option > dataType for each one, and respect custom formatters
      const comparator = getFilterComparisonProperties(filter.comparison).english
      return `${filter.field} ${comparator} ${filter.values.join(' or ')}`
    })
    .join(' and ')
}

export const translateFilterToEnglish = (filter: IFilterValue, filterOption: IFilterOption, entityName?: string) => {
  return `
  ${filter.exclude ? 'Exclude' : 'Only show'} ${entityName ?? ''} where ${filterOption.field} 
            ${getFilterComparisonProperties(filter.comparison).english} 
            ${
              filter.comparison === FilterComparison.IS_BETWEEN
                ? renderNumberValue(Number(filter.values[0]), filterOption) +
                  ' and ' +
                  renderNumberValue(Number(filter.values[1]), filterOption)
                : filterOption.dataType === FilterDatatype.string
                ? filter.values.join(' or ')
                : renderNumberValue(Number(filter.values[0]), filterOption)
            }
              `.replaceAll(/\s/g, ' ')
}

const renderNumberValue = (num: number, filterOption: IFilterOption) => {
  if (isNaN(num) || num === null || num === undefined) return ''
  if (filterOption.dataType === FilterDatatype.date) return new Date(num).toDateString()
  else return num.toLocaleString('en')
}
