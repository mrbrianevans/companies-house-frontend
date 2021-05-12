import * as React from 'react'
import { IFilterOption } from '../../../types/IFilters'
import { GetStaticProps } from 'next'
import { FilterPage } from '../../../components/FilterPage/FilterPage'
import { CompanyResultsTable } from '../../../components/FilterPage/ResultsTables/CompanyResultsTable'
import getCompanyFilters from '../../../interface/filterCompanies/getFilterOptions'

interface Props {
  filterOptions: IFilterOption[]
}
//todo: tomorrow 13 May 2021
// - whenever the list of filters is changed (can be done with useeffect)
// -- fetch the id calling filterRedirect
// -- use the id to make the "run query" button a link to filter/id
// this means results are ready before the button is pressed
// the button should be disabled while the results are loading
// this could be a problem for queries that take a long time to run? maybe a timeout?
// give the estimated result count in the same box as the preview button

const CompanyFilterPage = ({ filterOptions }: Props) => {
  return (
    <FilterPage
      ResultsTable={CompanyResultsTable}
      config={{
        getFilterIdApiUrl: '/api/companies/filterRedirect',
        redirectUrl: (id) => '/company/filter/' + id,
        labelPlural: 'companies',
        labelSingular: 'company'
      }}
      filterOptions={filterOptions}
    />
  )
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
