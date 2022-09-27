import { IFilterValue } from '../../types/IFilters'
import { FilterCategory } from '../../types/FilterCategory'
import { FilterConfigMap } from '../../configuration/filterConfigs'
import getFilterConfig from '../getFilterConfig'
import { getFilterOptionForFilterValue } from './getFilterOptionForFilterValue'
import { FilterDatatype } from '../../configuration/filterDatatypes'
import { FilterComparison, FilterComparisonsMap } from '../../configuration/filterComparisons'

/**
 * Checks if a filter is valid. This includes if the field exists, if the value type is correct and other checks.
 */

export const validateFilter: (filterValue: IFilterValue, category: FilterCategory) => boolean = (
  filterValue,
  category
) => {
  const validationFailures = []
  try {
    // check that the category is valid, and a config exists for it
    if (typeof category !== 'string' || !FilterConfigMap.has(category))
      throw new Error(`Category ${category} doesn't exist`)
    const config = getFilterConfig({ category })
    // check the shape of the filter value
    if (!filterValue || typeof filterValue !== 'object') throw new Error('filterValue is not an object')
    if (Object.keys(filterValue).sort().toString() !== ['comparison', 'field', 'exclude', 'values'].sort().toString())
      throw new Error("filterValue doesn't have correct keys: " + Object.keys(filterValue).join(','))
    // check that there are the correct number of values
    if (!(filterValue.values instanceof Array)) throw new Error('Values are not in an array')
    switch (filterValue.comparison) {
      case FilterComparison.LESS_THAN:
      case FilterComparison.GREATER_THAN:
      case FilterComparison.BEFORE:
      case FilterComparison.AFTER:
      case FilterComparison.REFERENCES:
        if (filterValue.values.length !== 1) validationFailures.push(`only one value allowed for <,> or ref`)
        break
      case FilterComparison.MATCHES:
      case FilterComparison.CONTAINS:
        if (filterValue.values.length < 1)
          validationFailures.push('less than one value provided for string matching comparison')
        break
      case FilterComparison.IS_BETWEEN:
        if (filterValue.values.length !== 2)
          validationFailures.push('filter must have 2 values for the in between comparison')
        break
    }
    // check that there is a filter in this category with the same field as the one requested
    if (!config.filters.some((filter) => filter.field === filterValue.field))
      throw new Error(`Field '${filterValue.field}' is not a valid option`)
    const filterOption = getFilterOptionForFilterValue({ filterValue, category })
    // check that the comparison used is allowed
    if (!FilterComparisonsMap.has(filterValue.comparison))
      throw new Error('filterValue comparison is not in FilterComparisonsMap')
    if (!filterOption.possibleComparisons.includes(filterValue.comparison))
      throw new Error('Comparison is not valid for this filter option')
    // check that values is an array
    if (!(filterValue.values instanceof Array)) throw new Error('values in filterValue are not an array')
    // check javascript types of values
    switch (filterOption.dataType) {
      case FilterDatatype.date:
      case FilterDatatype.number:
        if (filterValue.values.some((v) => typeof v !== 'number'))
          validationFailures.push('values are not all numbers, but filterOption datatype is number')
        break
      case FilterDatatype.string:
        if (filterValue.values.some((v) => typeof v !== 'string'))
          validationFailures.push('values are not all strings, but filterOption datatype is string')
    }
    if (filterValue.values.length === 2 && filterValue.comparison === FilterComparison.IS_BETWEEN) {
      if (filterValue.values[0] > filterValue.values[1]) validationFailures.push('min greater than max for in between')
    }
    if (typeof filterValue.exclude !== 'boolean') validationFailures.push('exclude is not a boolean')
  } catch (e) {
    validationFailures.push(e.message)
  }
  if (validationFailures.length) {
    console.log(validationFailures.length, 'filter validation errors')
    console.log(validationFailures)
  }
  return validationFailures.length === 0
}

export const filtersAreValid: (params: { filters: IFilterValue[]; category: FilterCategory }) => boolean = ({
  filters,
  category
}) => {
  return filters.every((filter, index) => validateFilter(filter, category))
}
