import { getFilterOptionForFilterValue } from '../filters/getFilterOptionForFilterValue'
import { IFilterValue } from '../../types/IFilters'
import { FilterCategory } from '../../types/FilterCategory'
import getFilterConfig from '../getFilterConfig'

type SqlFromConverterParams = {
  filters: IFilterValue[]
  category: FilterCategory
}
/**
 * Get the FROM clause for a set of filters. Performs the necessary joins.
 *
 * @return IMinorQuery
 */
export const getFromClause = ({ filters, category }: SqlFromConverterParams) => {
  const mainTable = getFilterConfig({ category }).main_table
  const joins = []
  for (const filter of filters) {
    const filterOption = getFilterOptionForFilterValue({ filterValue: filter, category })
    if (!filterOption) continue
    const ref = filterOption.references
    if (ref === undefined) continue
    joins.push(`JOIN ${ref.tableName} ON ${ref.tableName}.${ref.column}=${mainTable}.${filterOption.columnName}`)
  }
  return `  FROM ${mainTable}${joins.length ? '\n\t' + joins.join('\n\t') : ''}`
}
