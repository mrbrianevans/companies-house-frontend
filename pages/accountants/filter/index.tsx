import * as React from 'react'
import { IFilterOption } from '../../../types/IFilters'
import { GetStaticProps } from 'next'
import { FilterPage } from '../../../components/FilterPage/FilterPage'
import { AccountantResultsTable } from '../../../components/FilterPage/ResultsTables/AccountantResultsTable'
import { accountantFilterConfig } from '../../../configuration/accountantFilterConfig'
import { FilterCategory } from '../../../types/FilterCategory'
import getFilterOptions from '../../../interface/filter/getFilterOptions'

interface Props {
  filterOptions: IFilterOption[]
}

const AccountantFilterPage = ({ filterOptions }: Props) => {
  return (
    <FilterPage
      ResultsTable={AccountantResultsTable}
      config={accountantFilterConfig}
      category={FilterCategory.ACCOUNTANT}
      filterOptions={filterOptions}
    />
  )
}

export default AccountantFilterPage

export const getStaticProps: GetStaticProps = async (context) => {
  const returnProps: Props = {
    filterOptions: getFilterOptions({ category: FilterCategory.ACCOUNTANT })
  }
  return {
    props: returnProps
  }
}
