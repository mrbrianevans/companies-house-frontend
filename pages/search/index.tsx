import { Page } from '../../components/Page/Page'
import { TextInputWithButton } from '../../components/Inputs/TextInputWithButton'

// const styles = require('../../styles/Home.module.css')
const styles = require('../../styles/Search.module.sass')

const SearchPage = () => {
  return (
    <Page>
      <h1>Company search</h1>
      <div className={styles.searchRow}>
        <p className={styles.inputLabel}>
          <label htmlFor={'companyNumberSearchBox'}>Search by company number or name</label>
        </p>
        <TextInputWithButton
          textBoxPlaceholder={'05792439 or Tesco'}
          buttonLink={(value: string) => {
            if (value.match(/^[0-9]{6,8}|([A-Z]{2}[0-9]{6})$/)) return '/company/' + encodeURIComponent(value)
            else return '/search/' + encodeURIComponent(value)
          }}
          buttonText={'Search!'}
          textBoxId={'companyNumberSearchBox'}
          textBoxStyle={{ width: '80%', height: '3rem', fontSize: '1.25rem' }}
          buttonStyle={{ fontSize: '1.25rem', width: '20%' }}
        />
      </div>
    </Page>
  )
}

export default SearchPage
