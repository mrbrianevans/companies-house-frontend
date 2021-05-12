import { Page } from '../../components/Page/Page'
import * as React from 'react'
import { IFilterOption } from '../../types/IFilters'
import Link from 'next/link'

const FilterCompaniesPage = () => {
  return (
    <Page>
      <h1>Companies</h1>
      <p>
        To filter accountants, visit{' '}
        <Link href={'/company/filter'}>
          <a>/filter</a>
        </Link>
      </p>
    </Page>
  )
}

export default FilterCompaniesPage
