import { IFilterOption } from '../../types/IFilters'
import { getCompanyFilterList } from './listOfFilters'

const getCompanyFilters: () => IFilterOption[] = () => {
  return Array.from(getCompanyFilterList().values()).map((filter) => filter.filterOption)
}

export default getCompanyFilters
