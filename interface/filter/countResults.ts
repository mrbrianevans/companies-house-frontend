import { IFilter } from '../../types/IFilters'
import { FilterCategory } from "../../types/FilterCategory";

// todo: move to types directory for frontend access
interface CountResultsParams {
  filters: IFilter[],
  category: FilterCategory
}
/** takes a list of filters, combines the queries, queries the database for COUNT(combinedQueries) with no limit*/
const countResults: (params: CountResultsParams) => Promise<number> = async ({ filters, category }) => {
  return 0
}

export default countResults