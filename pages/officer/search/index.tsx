// this is the new search page for a officer
// this file is located in: /pages/officer/search/index.tsx

import getFilterConfig from '../../../helpers/getFilterConfig'
import { FilterCategory } from '../../../types/FilterCategory'
import { Page } from '../../../components/Page/Page'
import { OfficerSearchBar } from '../../../components/SearchBars/OfficerSearchBar'

const styles = require('../../../styles/Search.module.sass')

const category = FilterCategory.OFFICER
const filterConfig = getFilterConfig({ category })

const OfficerSearchPage = () => {
  return (
    <Page>
      <h1>Officer search</h1>
      <div className={styles.searchRow}>
        <p className={styles.inputLabel}>
          <label htmlFor={filterConfig.labelSingular + 'SearchBox'}>
            Search for {filterConfig.labelPlural} by name
          </label>
        </p>
        <OfficerSearchBar />
      </div>
    </Page>
  )
}

export default OfficerSearchPage
