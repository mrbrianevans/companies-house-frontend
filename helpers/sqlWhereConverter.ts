import { getFilterOptionForFilterValue } from './filters/getFilterOptionForFilterValue'
import { getFilterComparisonProperties } from './filters/getFilterComparisonProperties'
import { FilterComparison } from '../configuration/filterComparisons'
import { IFilterValue } from '../types/IFilters'
import { FilterCategory } from '../types/FilterCategory'
import { FilterDatatype } from '../configuration/filterDatatypes'
import getFilterConfig from './getFilterConfig'

type SqlWhereConverterParams = {
  filter: IFilterValue
  category: FilterCategory
  values: any[]
}
/**
 * Convert a operator and value into a WHERE condition for a SQL query.
 *
 * @return IMinorQuery
 */
export const sqlWhereConverter = ({ filter, category, values }: SqlWhereConverterParams) => {
  const filterOption = getFilterOptionForFilterValue({ filterValue: filter, category })
  const comparator = getFilterComparisonProperties(filter.comparison).sqlOperator
  const tableName = getFilterConfig({ category }).main_table
  const qualifiedName = tableName + '.' + filterOption.columnName
  let min, max
  if (filterOption.dataType === FilterDatatype.date) {
    min = new Date(filter.values[0])
    max = new Date(filter.values[1])
  } else if (filterOption.dataType === FilterDatatype.number) {
    min = filter.values[0]
    max = filter.values[1]
  }
  switch (filter.comparison) {
    case FilterComparison.IS_BETWEEN:
      return `${qualifiedName} ${comparator} $${values.push(min)} AND $${values.push(max)}`
    case FilterComparison.MATCHES:
      return `${qualifiedName} ${comparator} to_tsquery($${values.push(
        filter.values
          .map((v) =>
            v
              .toString()
              .replace(/[^a-z0-9-]+/i, ' ')
              .split(' ')
              .join('&')
          )
          .join('|')
      )})`
    case FilterComparison.CONTAINS:
      return `${qualifiedName} ${comparator} ANY($${values.push(filter.values.map((v) => `%${v}%`))})`
    case FilterComparison.AFTER:
    case FilterComparison.BEFORE:
    case FilterComparison.GREATER_THAN:
    case FilterComparison.LESS_THAN:
      return `${qualifiedName} ${comparator} $${values.push(min)}`
    case FilterComparison.EQUALS:
      return filter.values.map((value) => `${qualifiedName}=$${values.push(value)}`).join(' OR ')
  }
  console.log(
    JSON.stringify({
      severity: 'ERROR',
      message: 'No case triggered for where converter',
      filename: 'helpers/sqlWhereConverter'
    })
  )
  // if nothing else has been triggered, then there is an error. This will just skip this filter.
  return 'TRUE'
}
