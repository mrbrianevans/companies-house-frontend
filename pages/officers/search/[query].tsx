import { GetServerSideProps } from 'next'
import { Page } from '../../../components/Page/Page'
import { TextInputWithButton } from '../../../components/Inputs/TextInputWithButton'
import { ICompaniesHouseSearchApiResponse } from '../../../types/ICompaniesHouseApiResponse'
import axios from 'axios'
import Link from 'next/link'
import { searchCompaniesByName } from '../../../interface/api/SearchCompaniesByName'
import { searchOfficersByName } from '../../../interface/officer/searchOfficersByName'
import { IOfficer } from '../../../types/IOfficer'
import { OfficerSearchBar } from '../../../components/SearchBars/OfficerSearchBar'

const styles = require('../../../styles/Search.module.sass')
type SearchResultsProps = {
  query: string
  results: IOfficer[]
  responseTime: number
}
const SearchResults = ({ query, results, responseTime }: SearchResultsProps) => {
  return (
    <Page>
      <h1>Officer search results</h1>
      <div className={styles.searchRow}>
        <p className={styles.inputLabel}>
          <label htmlFor={'companyNumberSearchBox'}>Search for officers by name</label>
        </p>
        <OfficerSearchBar initialValue={query} />
      </div>
      <div className={styles.searchResultsContainer}>
        {results?.map((result) => (
          <div>
            <h3>
              {result.forenames} {result.surname}
            </h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        ))}
      </div>
    </Page>
  )
}

export default SearchResults

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.params.query.toString()
  const startTime = Date.now()
  const { results } = await searchOfficersByName({ query })
  const props: SearchResultsProps = Object.freeze({
    query,
    results: results,
    responseTime: Date.now() - startTime
  })
  return {
    props: props
  }
}
