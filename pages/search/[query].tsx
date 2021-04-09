import { GetServerSideProps } from 'next'
import { Page } from '../../components/Page/Page'
import { TextInputWithButton } from '../../components/Inputs/TextInputWithButton'
import { ICompaniesHouseSearchApiResponse } from '../../types/ICompaniesHouseApiResponse'
import axios from 'axios'
import Link from 'next/link'

const styles = require('../../styles/Search.module.sass')
type SearchResultsProps = {
  query: string
  results: ICompaniesHouseSearchApiResponse
  responseTime: number
}
const SearchResults = ({ query, results, responseTime }: SearchResultsProps) => {
  return (
    <Page>
      <h1>Search results</h1>
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
          initialValue={query}
        />
      </div>
      <p>
        {results.total_results} results for "{query}" in {responseTime}ms
      </p>
      <div className={styles.searchResultsContainer}>
        {results.items.map((result) => (
          <Link href={`/company/${result.company_number}`} key={result.company_number}>
            <a draggable={'false'} className={styles.searchResult}>
              <h3>{highlightSearchHits(result.title, result.matches.title)}</h3>
              <p>{highlightSearchHits(result.snippet, result.matches.snippet)}</p>
              <p>{highlightSearchHits(result.address_snippet, result.matches.address_snippet)}</p>
              <p>{result.description}</p>
            </a>
          </Link>
        ))}
      </div>
    </Page>
  )
}

export default SearchResults

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.params.query.toString()
  const startTime = Date.now()
  //this approach makes use of companies house search facility because mine is too slow
  const apiUrl = 'https://api.company-information.service.gov.uk/search/companies'
  const govResponse: ICompaniesHouseSearchApiResponse = await axios
    .get(apiUrl, {
      params: { q: query, items_per_page: 10 },
      auth: { username: process.env.APIUSER, password: '' }
    })
    .then((res) => res.data)
  console.log('Called government API for query', query)
  const props: SearchResultsProps = Object.freeze({
    query,
    results: govResponse,
    responseTime: Date.now() - startTime
  })
  return {
    props: props
  }
}

const highlightSearchHits: (text: string, textMatches?: number[], startingIndex?: number) => JSX.Element = (
  text,
  textMatches,
  startingIndex
) => {
  if (!textMatches || textMatches.length === 0) return <>{text}</>
  return (
    <>
      {text.slice(0, textMatches[0] - 1 - (startingIndex ?? 0))}
      <mark className={styles.highlight}>
        {text.slice(textMatches[0] - 1 - (startingIndex ?? 0), textMatches[1] - (startingIndex ?? 0))}
      </mark>
      {highlightSearchHits(text.slice(textMatches[1] - (startingIndex ?? 0)), textMatches.slice(2), textMatches[1])}
    </>
  )
}
