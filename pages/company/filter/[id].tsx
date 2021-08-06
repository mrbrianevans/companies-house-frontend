import * as React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { FilterPage } from '../../../components/FilterPage/FilterPage'
import { ICachedFilter } from '../../../types/ICachedFilter'
import { CompanyResultsTable } from '../../../components/FilterPage/ResultsTables/CompanyResultsTable'
import { FilterCategory } from '../../../types/FilterCategory'
import getFilterOptions from '../../../interface/filter/getFilterOptions'
import getCachedFilter from '../../../interface/filter/getCachedFilter'
import getFilterConfig from '../../../helpers/getFilterConfig'
import { ICompanyViewItem } from '../../../types/ICompanyView'

interface Props {
  savedFilter: ICachedFilter<ICompanyViewItem>
}
const category = FilterCategory.COMPANY
const filterConfig = getFilterConfig({ category })
const filterOptions = getFilterOptions({ category })

const CompanyFilterPage = ({ savedFilter }: Props) => {
  return (
    <FilterPage
      ResultsTable={CompanyResultsTable}
      config={filterConfig}
      filterOptions={filterOptions}
      category={category}
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
  const savedFilter = await getCachedFilter<ICompanyViewItem>({
    cachedFilterId: id,
    category
  })
  if (savedFilter === null) {
    return {
      notFound: true
    }
  }
  const returnProps: Props = {
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
