import { expect } from 'chai'
import { IFilterValue } from '../../../types/IFilters'
import { FilterConfigMap } from '../../../configuration/filterConfigs'
import { FilterCategory } from '../../../types/FilterCategory'
import getFilterOptions from '../../../interface/filter/getFilterOptions'
import { randomElement } from '../../../helpers/ArrayUtils'
import { FilterDatatype } from '../../../configuration/filterDatatypes'
import { FilterComparison } from '../../../configuration/filterComparisons'
import getFilterConfig from '../../../helpers/getFilterConfig'
import combineQueries from '../../../interface/filter/combineQueries'
import applyFilters from '../../../interface/filter/applyFilters'
import { prettyPrintSqlQuery } from '../../../helpers/prettyPrintSqlQuery'
import { validateFilter } from '../../../helpers/filters/validateFilter'

describe('creates random filters based on config and runs them against the database', function () {
  this.slow()
  it('should run in a reasonable time', async () => {
    for (let i = 0; i < 10; i++) {
      const { filters, category } = generateRandomFilters()
      const { query, value } = combineQueries({ filters, category })
      console.log(prettyPrintSqlQuery(query, value))
      const { executionTime } = await applyFilters({ filters, category, limit: 5 })
      expect(executionTime).to.be.lessThan(5000, 'filter took longer than 5s to execute')
    }
  })
})

const generateRandomFilter: (category: FilterCategory) => IFilterValue = (category) => {
  const config = getFilterConfig({ category })
  const filterOptions = getFilterOptions({ category })
  const filterOption = randomElement(filterOptions)
  const comparison = randomElement(filterOption.possibleComparisons)
  let values: string[] | [number, number] | [number]
  switch (filterOption.dataType) {
    case FilterDatatype.string:
      values = ['test', 'values', 'array']
      break
    case FilterDatatype.number:
      switch (comparison) {
        case FilterComparison.GREATER_THAN:
        case FilterComparison.LESS_THAN:
          values = [50]
          break
        case FilterComparison.IS_BETWEEN:
          values = [-50, 150]
          break
      }
      break
    case FilterDatatype.date:
      switch (comparison) {
        case FilterComparison.GREATER_THAN:
        case FilterComparison.LESS_THAN:
          values = [Date.now() - 86_400_000 * Math.random() * 100 * 365]
          break
        case FilterComparison.IS_BETWEEN:
          values = [
            Date.now() - 86_400_000 * 365 * (Math.random() * 50 + 50),
            Date.now() - 86_400_000 * Math.random() * 50 * 365
          ]
          break
      }
      break
  }
  const filter: IFilterValue = {
    field: filterOption.field,
    comparison,
    values,
    exclude: false
  }
  // console.log(translateFilterToEnglish(filter, filterOption, config.labelPlural))
  console.assert(validateFilter(filter, category))
  return filter
}

const generateRandomFilters = () => {
  const categories = Array.from(FilterConfigMap.keys())
  const category: FilterCategory = randomElement(categories)
  const filters: IFilterValue[] = Array(5)
    .fill(null)
    .map(() => generateRandomFilter(category))
  return {
    filters,
    category
  }
}
