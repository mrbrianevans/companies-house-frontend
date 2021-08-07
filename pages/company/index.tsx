import { Page } from '../../components/Page/Page'
import * as React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { CompanySearchBar } from '../../components/SearchBars/CompanySearchBar'
import { CompanyIndustrySearchBar } from '../../components/SearchBars/CompanyIndustrySearchBar'
import { FeatureList } from '../../components/lists/FeatureList'
import getFilterOptions from '../../interface/filter/getFilterOptions'
import { FilterCategory } from '../../types/FilterCategory'
import ButtonLink from '../../components/Inputs/ButtonLink'
import getFilterConfig from '../../helpers/getFilterConfig'
import { capitalizeEveryWord } from '../../helpers/StringManipulation'

const filterCategory = FilterCategory.OFFICER
const FilterCompaniesPage = () => {
  const [companyFilters] = useState(getFilterOptions({ category: FilterCategory.COMPANY }))
  const [config] = useState(getFilterConfig({ category: filterCategory }))
  return (
    <Page>
      <h1>{capitalizeEveryWord(config.labelPlural)}</h1>
      <h2>Search</h2>
      <p>
        To search for a {config.labelSingular} by name or company number, visit{' '}
        <Link href={'/search'}>
          <a>/search</a>
        </Link>{' '}
        or type your query right here.
      </p>
      <CompanySearchBar />
      <h2>Filter</h2>
      <p>
        To filter {config.labelPlural}, visit <ButtonLink href={'/company/filter'} />
      </p>
      <p>Get started with a filter by industry:</p>
      <CompanyIndustrySearchBar />
      <h3>Available filters:</h3>
      <FeatureList list={companyFilters.map((filter) => filter.field)} />
    </Page>
  )
}

export default FilterCompaniesPage
