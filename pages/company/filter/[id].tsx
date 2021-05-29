import { IFilterOption } from '../../../types/IFilters'
import * as React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getSavedFilter } from '../../../interface/filterCompanies/getSavedFilter'
import { FilterPage } from '../../../components/FilterPage/FilterPage'
import { ISavedFilter } from '../../../types/ISavedFilter'
import { ICompanyProfile } from '../../../types/ICompany'
import { CompanyResultsTable } from '../../../components/FilterPage/ResultsTables/CompanyResultsTable'
import getCompanyFilters from '../../../interface/filterCompanies/getFilterOptions'
import { companyFilterConfig } from '../../../configuration/companyFilterConfig'
interface Props {
  filterOptions?: IFilterOption[]
  savedFilter: ISavedFilter<ICompanyProfile>
}
const CompanyFilterPage = ({ savedFilter, filterOptions }: Props) => {
  return (
    <FilterPage
      ResultsTable={CompanyResultsTable}
      config={companyFilterConfig}
      filterOptions={filterOptions}
      savedFilter={savedFilter}
    />
  )
}

export default CompanyFilterPage

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

  const returnProps: Props = {
    filterOptions: getCompanyFilters(),
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
