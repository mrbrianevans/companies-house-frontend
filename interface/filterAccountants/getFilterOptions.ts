import { IFilterOption } from '../../types/IFilters'
import { getAccountantFilterList } from './listOfFilters'

const getAccountantFilters: () => IFilterOption[] = () => {
  return Array.from(getAccountantFilterList().values()).map((filter) => filter.filterOption)
}

export default getAccountantFilters
