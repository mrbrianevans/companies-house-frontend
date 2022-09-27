import { FilterPage } from '../../../components/FilterPage/FilterPage'
import { CompanyResultsTable } from '../../../components/FilterPage/ResultsTables/CompanyResultsTable'
import { FilterCategory } from '../../../types/FilterCategory'
import getFilterOptions from '../../../interface/filter/getFilterOptions'
import getFilterConfig from '../../../helpers/getFilterConfig'

const category = FilterCategory.COMPANY
const config = getFilterConfig({ category })
const filterOptions = getFilterOptions({ category })
const CompanyFilterPage = () => {
  return (
    <FilterPage ResultsTable={CompanyResultsTable} config={config} filterOptions={filterOptions} category={category} />
  )
}

export default CompanyFilterPage
