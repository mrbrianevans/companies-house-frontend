import { IFilterOption } from '../../../types/IFilters'
import * as React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { FilterPage } from '../../../components/FilterPage/FilterPage'
import { ISavedFilter } from '../../../types/ISavedFilter'
import { ICompanyProfile } from '../../../types/ICompany'
import { CompanyResultsTable } from '../../../components/FilterPage/ResultsTables/CompanyResultsTable'
import { companyFilterConfig } from '../../../configuration/companyFilterConfig'
import { FilterCategory } from '../../../types/FilterCategory'
import getFilterOptions from '../../../interface/filter/getFilterOptions'
import getCachedFilterWithResults from '../../../interface/filter/getCachedFilterWithResults'

interface Props {
  filterOptions?: IFilterOption[]
  savedFilter: ISavedFilter<ICompanyProfile>
}
const CompanyFilterPage = ({ savedFilter, filterOptions }: Props) => {
  return (
    <FilterPage
      ResultsTable={CompanyResultsTable}
      config={companyFilterConfig}
      category={FilterCategory.COMPANY}
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
  const savedFilter = await getCachedFilterWithResults<ICompanyProfile>({
    cachedFilterId: id,
    category: FilterCategory.COMPANY
  })
  if (savedFilter === null) {
    return {
      notFound: true
    }
  }
  const returnProps: Props = {
    filterOptions: getFilterOptions({ category: FilterCategory.COMPANY }),
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
