import { Page } from '../../../components/Page/Page'
import { TextInputWithButton } from '../../../components/Inputs/TextInputWithButton'
import { OfficerSearchBar } from '../../../components/SearchBars/OfficerSearchBar'

// const styles = require('../../styles/Home.module.css')
const styles = require('../../../styles/Search.module.sass')

const SearchPage = () => {
  return (
    <Page>
      <h1>Officer search</h1>
      <div className={styles.searchRow}>
        <p className={styles.inputLabel}>
          <label htmlFor={'companyNumberSearchBox'}>Search for officers by name</label>
        </p>
        <OfficerSearchBar />
      </div>
    </Page>
  )
}

export default SearchPage
