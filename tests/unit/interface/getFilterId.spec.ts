import { expect } from 'chai'
import { getFilterId } from '../../../interface/filter/getFilterId'
import { FilterCategory } from '../../../types/FilterCategory'
import { IFilterValue } from '../../../types/IFilters'
import { FilterComparison } from '../../../configuration/filterComparisons'
import { validateFilter } from '../../../helpers/filters/validateFilter'

describe('Get Filter ID interface method', function () {
  this.slow(2000)
  it('it should return a string id if a normal filter is passed', async () => {
    const { id } = await getFilterId({
      filters: [{ field: 'employees', exclude: false, values: [0, 1], comparison: FilterComparison.IS_BETWEEN }],
      category: FilterCategory.COMPANY
    })
    expect(id).to.be.a('string')
  })

  it('should return null if the filters array is empty', async () => {
    const output = await getFilterId({ filters: [], category: FilterCategory.COMPANY })
    expect(output).to.equal(null)
  })
})
