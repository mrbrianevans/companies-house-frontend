import { Page } from '../../components/Page/Page'
import { NewFilterCard } from '../../components/NewFilterCard/NewFilterCard'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { IFilter, IFilterOption } from '../../types/IFilters'
import getCompanyFilters from '../../interface/filterCompanies/getFilterOptions'
import Button from '../../components/Inputs/Button'
import { ICompanyProfile } from '../../types/ICompany'
import IconButton from '../../components/Inputs/IconButton'
import Link from 'next/link'

const styles = require('../../styles/CompanyFilter.module.sass')

type Props = {
  filterOptions: IFilterOption[]
}
const FilterCompanies = ({ filterOptions }: Props) => {
  const [showNewFilterForm, setShowNewFilterForm] = useState<boolean>(filterOptions.length > 0)
  const [filters, setFilters] = useState<IFilter[]>([])
  const addFilter = (filter: IFilter) => {
    setShowNewFilterForm(false)
    setFilters((prevState) => [filter, ...prevState])
    setTimeout(() => {
      setShowNewFilterForm(true)
    }, 1)
  }
  const [filterMatchesLoading, setFilterMatchesLoading] = useState(false)
  const [filterMatchesLoaded, setFilterMatchesLoaded] = useState(false)
  const [requestResponseTime, setRequestResponseTime] = useState<number | undefined>()
  const [resultSetSize, setResultSetSize] = useState<number>()
  const [resultSetSizeLoading, setResultSetSizeLoading] = useState<boolean>(true)
  const applyFilter = () => {
    const requestFilterTime = Date.now()
    setFilterMatchesLoading(true)
    setFilterMatchesLoaded(false)
    fetch('/api/companies/filter', {
      method: 'POST',
      body: JSON.stringify(filters),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((r) => {
        if (r.status === 200) return r
        else throw new Error(JSON.stringify(r.json()))
      })
      .then((r) => r.json())
      .then((j: ICompanyProfile[]) => setMatchingCompanies(j))
      .then(() => setRequestResponseTime(Date.now() - requestFilterTime))
      .then(() => setFilterMatchesLoaded(true))
      .catch(console.error)
      .finally(() => setFilterMatchesLoading(false))
    setResultSetSizeLoading(true)
    fetch('/api/companies/countFilterResults', {
      method: 'POST',
      body: JSON.stringify(filters),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((r) => {
        if (r.status === 200) return r
        else throw new Error(JSON.stringify(r.json()))
      })
      .then((r) => r.json())
      .then((j: { count: number }) => setResultSetSize(j.count))
      .then(() => setResultSetSizeLoading(false))
      .catch(console.error)
  }
  const [matchingCompanies, setMatchingCompanies] = useState<ICompanyProfile[]>()

  //this is the auto-runner (whenever filters change, fetch the results)
  useEffect(() => {
    if (filters.length) applyFilter()
  }, [filters])
  return (
    <Page>
      <h1>Filter companies</h1>
      <p>This feature is still in development</p>
      <div className={styles.topLevelContainer}>
        <NewFilterCard addFilter={addFilter} filterOptions={filterOptions} filteringLabel={'companies'} />
        {filters.length !== 0 && (
          <div className={styles.filterContainer}>
            {filters?.map((filter, i) => (
              <div>
                {filter.category} {filter.comparison}{' '}
                {filter.type === 'string' ? filter.values.join(' or ') : filter.min + ' and ' + filter.max}
                <IconButton
                  label={'\u00D7'}
                  onClick={() => setFilters((prevState) => prevState.filter((value, index) => index !== i))}
                  floatRight
                />
              </div>
            ))}
            {/*this button is not needed if auto-run is enabled*/}
            {/*<Button label={'Run query'} onClick={applyFilter} />*/}
          </div>
        )}
        {filterMatchesLoading && <p>loading</p>}
        {filterMatchesLoaded && (
          <div>
            {resultSetSizeLoading || `${resultSetSize} results in ${requestResponseTime}ms`}
            <table className={styles.results}>
              <thead>
                <tr>
                  <th />
                  <th>Company number</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Type of company</th>
                </tr>
              </thead>
              <tbody>
                {matchingCompanies?.length &&
                  matchingCompanies.map((company, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        <Link href={'/company/' + company.company_number}>
                          <a target={'_blank'}>{company.company_number}</a>
                        </Link>
                      </td>
                      <td>{company.name}</td>
                      <td>
                        {Math.round((Date.now() - new Date(company.date_of_creation).valueOf()) / 86400 / 365 / 1000)}{' '}
                        years
                      </td>
                      <td>{company.category}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
        <div>
          <h3>Planned features</h3>
          <p>I want to add these filters in the future:</p>
          <ul>
            <li>events (change of ownership)</li>
            <li>accounts (profit, assets, employees etc)</li>
            <li>improved area filtering</li>
            <li>officers and PSCs</li>
            <li>company type/category (PLC,LLP,LTD etc)</li>
            <li>status (active/dissolved etc)</li>
            <li>type of accounts filed (micro/small/full etc)</li>
          </ul>
          <p>I want a pre-set filters section for very common filters, such as only active companies</p>
          <p>Auto-run the query every time a new query is added or an existing one deleted</p>
        </div>
      </div>
    </Page>
  )
}

export default FilterCompanies

export const getStaticProps: GetStaticProps = async (context) => {
  const returnProps: Props = {
    filterOptions: getCompanyFilters()
  }
  return {
    props: returnProps
  }
}
