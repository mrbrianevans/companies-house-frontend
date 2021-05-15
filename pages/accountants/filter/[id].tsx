import { IFilterOption } from '../../../types/IFilters'
import { IAccountant } from '../../../types/IAccountant'
import * as React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getSavedFilter } from '../../../interface/filterAccountants/getSavedFilter'
import getAccountantFilters from '../../../interface/filterAccountants/getFilterOptions'
import { FilterPage } from '../../../components/FilterPage/FilterPage'
import { AccountantResultsTable } from '../../../components/FilterPage/ResultsTables/AccountantResultsTable'
import { ISavedFilter } from '../../../types/ISavedFilter'
import { accountantFilterConfig } from '../../../configuration/accountantFilterConfig'
import { saveNewFilter } from '../../../interface/filterAccountants/saveNewFilter'

interface Props {
  filterOptions?: IFilterOption[]
  savedFilter: ISavedFilter<IAccountant>
}
const AccountantFilterPage = ({ savedFilter, filterOptions }: Props) => {
  return (
    <FilterPage
      ResultsTable={AccountantResultsTable}
      config={accountantFilterConfig}
      filterOptions={filterOptions}
      savedFilter={savedFilter}
    />
  )
}

export default AccountantFilterPage

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params
  if (typeof id !== 'string') {
    return {
      notFound: true
    }
  }
  const savedFilter = await getSavedFilter(id)
  if (savedFilter === null) {
    return {
      notFound: true
    }
  }
  //todo: if the saved filter was run a long time ago, revalidate it in the background
  const returnProps: Props = {
    filterOptions: getAccountantFilters(),
    savedFilter: savedFilter
  }
  return {
    props: returnProps,
    revalidate: 86400 // extract to environment or global variable
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  // this could potentially fetch a list of the 100 most popular filters ??
  return {
    paths: [],
    fallback: true
  }
}
