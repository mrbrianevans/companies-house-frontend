import * as React from 'react'
import { IFilterOption } from '../../../types/IFilters'
import { GetStaticProps } from 'next'
import getAccountantFilters from '../../../interface/filterAccountants/getFilterOptions'
import { FilterPage } from '../../../components/FilterPage/FilterPage'
import { AccountantResultsTable } from '../../../components/FilterPage/ResultsTables/AccountantResultsTable'

interface Props {
  filterOptions: IFilterOption[]
}

const AccountantFilterPage = ({ filterOptions }: Props) => {
  return (
    <FilterPage
      ResultsTable={AccountantResultsTable}
      config={{
        getFilterIdApiUrl: '/api/accountants/filterRedirect',
        redirectUrl: (id) => '/accountants/filter/' + id,
        labelPlural: 'accountants',
        labelSingular: 'accountant'
      }}
      filterOptions={filterOptions}
    />
  )
}

export default AccountantFilterPage

export const getStaticProps: GetStaticProps = async (context) => {
  const returnProps: Props = {
    filterOptions: getAccountantFilters()
  }
  return {
    props: returnProps
  }
}
