// this is the filter index page for a officer
// this file is located in: /pages/officer/filter/index.tsx

import { FilterPage } from '../../../components/FilterPage/FilterPage'
import { FilterCategory } from '../../../types/FilterCategory'
import getFilterOptions from '../../../interface/filter/getFilterOptions'
import getFilterConfig from '../../../helpers/getFilterConfig'

const category = FilterCategory.OFFICER
const filterConfig = getFilterConfig({ category })
const filterOptions = getFilterOptions({ category })
const OfficerFilterPage = () => {
  return <FilterPage ResultsTable={undefined} config={filterConfig} filterOptions={filterOptions} category={category} />
}

export default OfficerFilterPage
