import { Page } from '../../components/Page/Page'
import * as React from 'react'
import Link from 'next/link'
import { CompanySearchBar } from '../../components/SearchBars/CompanySearchBar'
import { CompanyIndustrySearchBar } from '../../components/SearchBars/CompanyIndustrySearchBar'
import getCompanyFilters from '../../interface/filterCompanies/getFilterOptions'
import { useState } from 'react'
import { FeatureList } from '../../components/lists/FeatureList'

const FilterCompaniesPage = () => {
  const [companyFilters] = useState(getCompanyFilters())
  return (
    <Page>
      <h1>Companies</h1>
      <h2>Search</h2>
      <p>
        To search for a company by name or company number, visit{' '}
        <Link href={'/search'}>
          <a>/filter</a>
        </Link>
      </p>
      <CompanySearchBar />
      <h2>Filter</h2>
      <p>
        To filter companies, visit{' '}
        <Link href={'/company/filter'}>
          <a>/filter</a>
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
