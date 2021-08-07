import { FilterComparison, FilterComparisonsMap } from '../../../configuration/filterComparisons'
import { expect } from 'chai'
import { getFilterComparisonProperties } from '../../../helpers/filters/getFilterComparisonProperties'

describe('make sure that all the filter comparisons are mapped to an english and sql equivalent', () => {
  it('should have a map entry for every filter comparison', () => {
    for (const filterComparison of Object.values(FilterComparison)) {
      if (typeof filterComparison !== 'number') continue
      expect(FilterComparisonsMap.has(filterComparison)).to.be.equal(
        true,
        'No map entry for ' + FilterComparison[filterComparison]
      )
      expect(getFilterComparisonProperties(filterComparison).english).to.not.be.null
      expect(getFilterComparisonProperties(filterComparison).sqlOperator).to.not.be.null
    }
  })
})
