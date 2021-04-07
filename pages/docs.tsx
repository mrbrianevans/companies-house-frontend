import { Page } from '../components/Page/Page'

const styles = require('../styles/Home.module.css')
const apiDocs = () => {
  return (
    <Page>
      <h1>GUI Documentation</h1>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Search</h3>
          The search feature allows you to search for a company by name, company number or person with significant
          control.
        </div>
        <div className={styles.card}>
          <h3>Filter</h3>
          The filter feature allows you to select from companies house, companies which match certain criteria such as
          financials and other information stored on companies house.
        </div>
      </div>
    </Page>
  )
}

export default apiDocs
