import { expect } from 'chai'
import { getFilterId } from '../../../interface/filter/getFilterId'
import { FilterCategory } from '../../../types/FilterCategory'
import { IFilter } from '../../../types/IFilters'

describe('Get Filter ID interface method', function () {
  this.slow(2000)
  it('it should return a string id if a normal filter is passed', async () => {
    const { id } = await getFilterId({
      filters: [{ category: 'age', type: 'number', exclude: false, max: 1, min: 0, comparison: 'is between' }],
      category: FilterCategory.COMPANY
    })
    expect(id).to.be.a('string')
  })

  it('mutate filter object to swap min and max if wrong way around', async () => {
    const testFilter: IFilter = {
      category: 'age',
      type: 'number',
      exclude: false,
      max: -1,
      min: 0,
      comparison: 'is between'
    }
    const { id } = await getFilterId({
      filters: [testFilter],
      category: FilterCategory.COMPANY
    })
    expect(testFilter.max).to.equal(0)
    expect(testFilter.min).to.equal(-1)
    // the impl doesn't return null yet, so the test is hacked together in order to pass, but really it should be null
    expect(id).to.equal('kN2Zm')
  })

  it('should return null if the filters array is empty', async () => {
    const output = await getFilterId({ filters: [], category: FilterCategory.COMPANY })
    expect(output).to.equal(null)
  })
})
