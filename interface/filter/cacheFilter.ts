import { IFilter } from '../../types/IFilters'
import { FilterCategory } from "../../types/FilterCategory";

type CacheFilterParams = {
  filters: IFilter[];
  category: FilterCategory
}
/** caches a filter and its results in saved_filters (although this should be renamed to cached_filters, and results moved to a different table)
 * @returns id of the cached filter
 */
const cacheFilter: (params: CacheFilterParams) => Promise<string> = async ({
  filters, category
}) => {
  return ''
}
export default cacheFilter
