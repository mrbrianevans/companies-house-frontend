// this is the search results page for a $NAME 
// this file is located in: /${DIR_PATH}/${FILE_NAME}
#set($lower_first_letter = $NAME.substring(0,1).toLowerCase())
#set($upper_first_letter = $NAME.substring(0,1).toUpperCase())
#set($the_rest = $NAME.substring(1))
#set($camelName = ${lower_first_letter} + ${the_rest})
#set($PascalName = ${upper_first_letter} + ${the_rest})
#set($nameEnum = $NAME.toUpperCase())

import { GetServerSideProps } from 'next'
import Link from 'next/link'
import getFilterConfig from '../../../helpers/getFilterConfig'
import { Page } from '../../../components/Page/Page'
import { search${PascalName}sByName } from '../../../interface/officer/search${PascalName}sByName'
import { ${PascalName}SearchBar } from '../../../components/SearchBars/${PascalName}SearchBar'
import { I${PascalName}Item as ResultType } from '../../../types/I${PascalName}'
import { FilterCategory } from '../../../types/FilterCategory'
const styles = require('../../../styles/Search.module.sass')

const category = FilterCategory.$nameEnum
const filterConfig = getFilterConfig({category})

type ${PascalName}SearchResultsProps = {
  query: string
  results: ResultType[]
  responseTime: number
}
const ${PascalName}SearchPage = ({ query, results, responseTime }: ${PascalName}SearchResultsProps) => {
  return (
    <Page>
      <h1>${PascalName} search</h1>
      <div className={styles.searchRow}>
        <p className={styles.inputLabel}>
          <label htmlFor={filterConfig.labelSingular+'SearchBox'}>Search for {filterConfig.labelPlural} by name</label>
        </p>
        <${PascalName}SearchBar initialValue={query} />
      </div>
      <div className={styles.searchResultsContainer}>
        {results?.map((result) => (
          <Link href={'/'+filterConfig.urlPath+'/'+Object.values(result)[0]} key={Object.values(result)[0]}>
            <a draggable={'false'} className={styles.searchResult}>
            <h3>{Object.values(result)[0]}</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
            </a>
          </Link>
        ))}
      </div>
    </Page>
  )
}

export default ${PascalName}SearchPage


export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.params.query.toString()
  const startTime = Date.now()
  const { results } = await search${PascalName}sByName({ query })
  const props: ${PascalName}SearchResultsProps = Object.freeze({
    query,
    results: results,
    responseTime: Date.now() - startTime
  })
  return {
    props: props
  }
}