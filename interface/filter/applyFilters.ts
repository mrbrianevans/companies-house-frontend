/** takes a list of filters, converts them to queries using combineQueries, queries the database, and returns a result list*/
import { IFilter } from '../../types/IFilters'
import { FilterCategory } from '../../types/FilterCategory'

type Params = {
  filters: IFilter[]
  category: FilterCategory
  limit: number
  sort: string[]
}
const applyFilters: (params: Params) => Promise<{}[]> = async ({ filters, category, limit, sort }): Promise<{}[]> => {
  return []
}

export default applyFilters
