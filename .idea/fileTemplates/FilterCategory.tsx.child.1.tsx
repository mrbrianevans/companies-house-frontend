// this is the filter index page for a $NAME 
// this file is located in: /${DIR_PATH}/${FILE_NAME}
#set($lower_first_letter = $NAME.substring(0,1).toLowerCase())
#set($upper_first_letter = $NAME.substring(0,1).toUpperCase())
#set($the_rest = $NAME.substring(1))
#set($camelName = ${lower_first_letter} + ${the_rest})
#set($PascalName = ${upper_first_letter} + ${the_rest})
#set($nameEnum = $NAME.toUpperCase())

import { FilterPage } from '../../../components/FilterPage/FilterPage'
import { CompanyResultsTable } from '../../../components/FilterPage/ResultsTables/CompanyResultsTable'
import { FilterCategory } from '../../../types/FilterCategory'
import getFilterOptions from '../../../interface/filter/getFilterOptions'
import getFilterConfig from '../../../helpers/getFilterConfig'

const category = FilterCategory.$nameEnum
const filterConfig = getFilterConfig({category})
const filterOptions = getFilterOptions({ category })
const ${PascalName}FilterPage = () => {
  return (
    <FilterPage
      ResultsTable={undefined}
      config={filterConfig}
      filterOptions={filterOptions}
      category={category}
    />
  )
}

export default ${PascalName}FilterPage