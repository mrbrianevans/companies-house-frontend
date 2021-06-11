import { Page } from '../../components/Page/Page'
import * as React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { CompanySearchBar } from '../../components/SearchBars/CompanySearchBar'
import { CompanyIndustrySearchBar } from '../../components/SearchBars/CompanyIndustrySearchBar'
import { FeatureList } from '../../components/lists/FeatureList'
import getFilterOptions from '../../interface/filter/getFilterOptions'
import { FilterCategory } from '../../types/FilterCategory'

const FilterCompaniesPage = () => {
  const [companyFilters] = useState(getFilterOptions({ category: FilterCategory.COMPANY }))
  return (
    <Page>
      <h1>Companies</h1>
      <h2>Search</h2>
      <p>
        To search for a company by name or company number, visit{' '}
        <Link href={'/search'}>
          <a>/search</a>
        </Link>
      </p>
      <CompanySearchBar />
      <h2>Filter</h2>
      <p>
        To filter companies, visit{' '}
        <Link href={'/company/filter'}>
          <a>/company/filter</a>
        </Link>
      </p>
      <p>Get started with a filter by industry:</p>
      <CompanyIndustrySearchBar />
      <h3>Available filters:</h3>
      <FeatureList list={companyFilters.map((filter) => filter.category)} />
    </Page>
  )
}

export default FilterCompaniesPage
