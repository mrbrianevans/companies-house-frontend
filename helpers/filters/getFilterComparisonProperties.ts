import { FilterComparison, FilterComparisonsMap } from '../../configuration/filterComparisons'

type FilterComparisonProperties = {
  sqlOperator: string
  english: string
}
/**
 * Returns the english and SQL versions of a FilterComparison enum
 */
export const getFilterComparisonProperties: (comparison: FilterComparison) => FilterComparisonProperties = (
  comparison
) => {
  if (FilterComparisonsMap.has(comparison)) return FilterComparisonsMap.get(comparison)
  throw Error('Comparison not found "' + comparison + '" of type ' + typeof comparison)
}
