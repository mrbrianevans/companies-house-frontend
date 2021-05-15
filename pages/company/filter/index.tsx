import * as React from 'react'
import { IFilterOption } from '../../../types/IFilters'
import { GetStaticProps } from 'next'
import { FilterPage } from '../../../components/FilterPage/FilterPage'
import { CompanyResultsTable } from '../../../components/FilterPage/ResultsTables/CompanyResultsTable'
import getCompanyFilters from '../../../interface/filterCompanies/getFilterOptions'
import { companyFilterConfig as filterConfig } from '../../../configuration/companyFilterConfig'

interface Props {
  filterOptions: IFilterOption[]
}
//todo: give the estimated result count in the same box as the preview button
const CompanyFilterPage = ({ filterOptions }: Props) => {
  return <FilterPage ResultsTable={CompanyResultsTable} config={filterConfig} filterOptions={filterOptions} />
}

export default CompanyFilterPage

export const getStaticProps: GetStaticProps = async (context) => {
  const returnProps: Props = {
    filterOptions: getCompanyFilters()
  }
  return {
    props: returnProps
  }
}
