import { Page } from "../components/Page";

const styles = require("../styles/Home.module.css");

const apiDocs = () => {
  return (
    <Page>
      <h1>API Documentation</h1>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Search</h3>
          The search endpoint allows you to search for a company by name,
          company number or person with significant control. It returns a JSON
          array of companies with summary details, which you can then use to
          aquire more details about particular companies.
        </div>
        <div className={styles.card}>
          <h3>Filter</h3>
          The filter endpoint allows you to select from companies house,
          companies which match certain criteria such as financials and other
          information stored on companies house. It returns a JSON array of
          companies with full details, including financials.
        </div>
      </div>
    </Page>
  )
}

export default apiDocs;
