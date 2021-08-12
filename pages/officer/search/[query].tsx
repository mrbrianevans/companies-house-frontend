// this is the search results page for a officer
// this file is located in: /pages/officer/search/[query].tsx

import { GetServerSideProps } from 'next'
import Link from 'next/link'
import getFilterConfig from '../../../helpers/getFilterConfig'
import { Page } from '../../../components/Page/Page'
import { searchOfficersByName } from '../../../interface/officer/searchOfficersByName'
import { OfficerSearchBar } from '../../../components/SearchBars/OfficerSearchBar'
import { IOfficerDatabaseItem as ResultType } from '../../../types/IOfficer'
import { FilterCategory } from '../../../types/FilterCategory'
import { serialiseResultDates } from '../../../helpers/serialiseResultDates'
import { OfficerResultsTable } from '../../../components/FilterPage/ResultsTables/OfficerResultsTable'

const styles = require('../../../styles/Search.module.sass')

const category = FilterCategory.OFFICER
const filterConfig = getFilterConfig({ category })

type OfficerSearchResultsProps = {
  query: string
  results: ResultType[]
  responseTime: number
}
const OfficerSearchPage = ({ query, results, responseTime }: OfficerSearchResultsProps) => {
  return (
    <Page>
      <h1>Officer search results</h1>
      <div className={styles.searchRow}>
        <p className={styles.inputLabel}>
          <label htmlFor={filterConfig.labelSingular + 'SearchBox'}>
            Search for {filterConfig.labelPlural} by name
          </label>
        </p>
        <OfficerSearchBar initialValue={query} />
      </div>
      <div className={styles.searchResultsContainer}>
        <OfficerResultsTable matchingResults={results} tableClassName={null} filterConfig={filterConfig} />
      </div>
    </Page>
  )
}

export default OfficerSearchPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.params.query.toString()
  const startTime = Date.now()
  const { results } = await searchOfficersByName({ query })
  const props: OfficerSearchResultsProps = Object.freeze({
    query,
    results: serialiseResultDates(results),
    responseTime: Date.now() - startTime
  })
  return {
    props: props
  }
}
