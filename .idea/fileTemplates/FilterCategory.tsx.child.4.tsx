// this is the new search page for a $NAME
// this file is located in: /${DIR_PATH}/${FILE_NAME}
#set($lower_first_letter = $NAME.substring(0,1).toLowerCase())
#set($upper_first_letter = $NAME.substring(0,1).toUpperCase())
#set($the_rest = $NAME.substring(1))
#set($camelName = ${lower_first_letter} + ${the_rest})
#set($PascalName = ${upper_first_letter} + ${the_rest})
#set($nameEnum = $NAME.toUpperCase())

import getFilterConfig from '../../../helpers/getFilterConfig'
import { FilterCategory } from '../../../types/FilterCategory'
import { Page } from '../../../components/Page/Page'
import { ${PascalName}SearchBar } from '../../../components/SearchBars/${PascalName}SearchBar'
const styles = require('../../../styles/Search.module.sass')

const category = FilterCategory.$nameEnum
const filterConfig = getFilterConfig({category})

const ${PascalName}SearchPage = () => {
  return (
    <Page>
      <h1>${PascalName} search</h1>
      <div className={styles.searchRow}>
        <p className={styles.inputLabel}>
          <label htmlFor={filterConfig.labelSingular+'SearchBox'}>Search for {filterConfig.labelPlural} by name</label>
        </p>
        <${PascalName}SearchBar />
      </div>
    </Page>
  )
}

export default ${PascalName}SearchPage
