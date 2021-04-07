import Link from 'next/link'
import { Page } from '../components/Page/Page'
import { TextInputWithButton } from '../components/TextInputWithButton'

const styles = require('../styles/Home.module.css')
export default function Home() {
  return (
    <Page>
      <div className={styles.featureBrowserGrid}>
        <div className={styles.searchBar}>
          <label htmlFor={'companyNumberSearchBox'}>Search for a company: </label>{' '}
          <TextInputWithButton
            textBoxPlaceholder={'05792439 or Tesco'}
            buttonLink={getSearchLink}
            buttonText={'Search!'}
            textBoxId={'companyNumberSearchBox'}
          />
        </div>
        <Link href={'/accountants'}>
          <a>
            <h3>Filter accountants</h3>
            <p>This uses accountants discolsure on accounts</p>
          </a>
        </Link>
        <Link href={'/filter'}>
          <a>
            <h3>Filter companies</h3>
            <p>View a companies accounts filings and other information held by companies house</p>
          </a>
        </Link>
        <div className={styles.aboutCard}>
          <h3>About</h3>
          <p>This is a facility to filter UK companies using data from companies house</p>
        </div>
      </div>
    </Page>
  )
}

const getSearchLink = (value: string) => {
  if (value.match(/^[0-9]{6,8}|([A-Z]{2}[0-9]{6})$/)) return 'company/' + value
  else return '/search' + (value ? '/' + value : '')
}
