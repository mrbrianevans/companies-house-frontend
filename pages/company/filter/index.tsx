import * as React from 'react'
import { IFilterOption } from '../../../types/IFilters'
import { GetStaticProps } from 'next'
import { FilterPage } from '../../../components/FilterPage/FilterPage'
import { CompanyResultsTable } from '../../../components/FilterPage/ResultsTables/CompanyResultsTable'
import getCompanyFilters from '../../../interface/filterCompanies/getFilterOptions'
import { companyFilterConfig as filterConfig } from '../../../configuration/companyFilterConfig'
import { FilterCategory } from '../../../types/FilterCategory'
import getFilterOptions from '../../../interface/filter/getFilterOptions'

interface Props {
  filterOptions: IFilterOption[]
}
//todo: give the estimated result count in the same box as the preview button
const CompanyFilterPage = ({ filterOptions }: Props) => {
  return <FilterPage ResultsTable={CompanyResultsTable} config={filterConfig} filterOptions={filterOptions} category={FilterCategory.COMPANY} />
}

export default CompanyFilterPage

export const getStaticProps: GetStaticProps = async (context) => {
  const returnProps: Props = {
    filterOptions: getFilterOptions({category: FilterCategory.COMPANY})
  }
  return {
    props: returnProps
  }
}
