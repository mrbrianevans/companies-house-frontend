// this is the about page for a $NAME 
// this file is located in: /${DIR_PATH}/${FILE_NAME}
#set($lower_first_letter = $NAME.substring(0,1).toLowerCase())
#set($upper_first_letter = $NAME.substring(0,1).toUpperCase())
#set($the_rest = $NAME.substring(1))
#set($camelName = ${lower_first_letter} + ${the_rest})
#set($PascalName = ${upper_first_letter} + ${the_rest})
#set($nameEnum = $NAME.toUpperCase())
import Link from 'next/link'
import { useState } from 'react'
import { Page } from '../../components/Page/Page'
import getFilterOptions from '../../interface/filter/getFilterOptions'
import { FilterCategory } from '../../types/FilterCategory'
import ButtonLink from '../../components/Inputs/ButtonLink'
import getFilterConfig from '../../helpers/getFilterConfig'
import { FeatureList } from '../../components/lists/FeatureList'
import { capitalizeEveryWord } from '../../helpers/StringManipulation'
import { ${PascalName}SearchBar } from '../../components/SearchBars/${PascalName}SearchBar'

const category = FilterCategory.$nameEnum

const ${PascalName}AboutPage = () => {
  const [filters] = useState(getFilterOptions({ category }))
  const [config] = useState(getFilterConfig({category}))
  return (
    <Page>
        <h1>{capitalizeEveryWord(config.labelPlural)}</h1>
		<h2>Search</h2>
      <p>
        To search for a {config.labelSingular} visit{' '}
        <Link href={'/'+config.urlPath+'/search'}>
          <a>{config.labelSingular} search</a>
        </Link>{' '}
        or type your query right here.
      </p>
      <${PascalName}SearchBar />
      <h2>Filter</h2>
      <p>
        To filter {config.labelPlural}, visit <ButtonLink href={'/'+config.urlPath+'/filter'} />
      </p>
      <h3>Available filters:</h3>
      <FeatureList list={filters.map((filter) => filter.category)} />
    </Page>
  )
}

export default ${PascalName}AboutPage