
import { IFilter } from '../../types/IFilters'
import { IMinorQuery } from '../../types/IQueries'
import { FilterCategory } from "../../types/FilterCategory";

type Params = {
  filters: IFilter[]
  category: FilterCategory
}
/** combines multiple queries using either INTERSECT or EXCEPT depending on exclusion
 * takes a list of filters, returns a SQL query string to get the distinct unique identifiers
 */
const combineQueries: (params: Params) => IMinorQuery = ({filters, category}) => {
  return {query: '', value: []}
}

export default combineQueries