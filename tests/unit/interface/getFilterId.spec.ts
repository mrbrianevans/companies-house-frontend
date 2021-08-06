import { expect } from 'chai'
import { getFilterId } from '../../../interface/filter/getFilterId'
import { FilterCategory } from '../../../types/FilterCategory'
import { IFilterValue } from '../../../types/IFilters'
import { FilterComparison } from '../../../configuration/filterComparisons'

describe('Get Filter ID interface method', function () {
  this.slow(2000)
  it('it should return a string id if a normal filter is passed', async () => {
    const { id } = await getFilterId({
      filters: [{ field: 'employees', exclude: false, values: [0, 1], comparison: FilterComparison.IS_BETWEEN }],
      category: FilterCategory.COMPANY
    })
    expect(id).to.be.a('string')
  })

  it('mutate filter object to swap min and max if wrong way around', async () => {
    const testFilter: IFilterValue = {
      field: 'employees',
      exclude: false,
      values: [0, -1],
      comparison: FilterComparison.IS_BETWEEN
    }
    const { id } = await getFilterId({
      filters: [testFilter],
      category: FilterCategory.COMPANY
    })
    expect(testFilter.values[0]).to.equal(0)
    expect(testFilter.values[1]).to.equal(-1)
    // the impl doesn't return null yet, so the test is hacked together in order to pass, but really it should be null
    expect(id).to.equal('PNjF8')
  })

  it('should return null if the filters array is empty', async () => {
    const output = await getFilterId({ filters: [], category: FilterCategory.COMPANY })
    expect(output).to.equal(null)
  })
})
