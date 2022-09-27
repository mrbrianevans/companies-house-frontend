// this is the about page for a officer
// this file is located in: /pages/officer/index.tsx
import Link from 'next/link'
import { useState } from 'react'
import { Page } from '../../components/Page/Page'
import getFilterOptions from '../../interface/filter/getFilterOptions'
import { FilterCategory } from '../../types/FilterCategory'
import ButtonLink from '../../components/Inputs/ButtonLink'
import getFilterConfig from '../../helpers/getFilterConfig'
import { FeatureList } from '../../components/lists/FeatureList'
import { capitalizeEveryWord } from '../../helpers/utils/StringUtils'
import { OfficerSearchBar } from '../../components/SearchBars/OfficerSearchBar'

const category = FilterCategory.OFFICER

const OfficerAboutPage = () => {
  const [filters] = useState(getFilterOptions({ category }))
  const [config] = useState(getFilterConfig({ category }))
  return (
    <Page>
      <h1>{capitalizeEveryWord(config.labelPlural)}</h1>
      <h2>Search</h2>
      <p>
        To search for a {config.labelSingular} visit{' '}
        <Link href={'/' + config.urlPath + '/search'}>
          <a>{config.labelSingular} search</a>
        </Link>{' '}
        or type your query right here.
      </p>
      <OfficerSearchBar />
      <h2>Filter</h2>
      <p>
        To filter {config.labelPlural}, visit <ButtonLink href={'/' + config.urlPath + '/filter'} />
      </p>
      <h3>Available filters:</h3>
      <FeatureList list={filters.map((filter) => filter.field)} />
    </Page>
  )
}

export default OfficerAboutPage
