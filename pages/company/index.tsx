import { Page } from '../../components/Page/Page'
import { NewFilterCard } from '../../components/NewFilterCard/NewFilterCard'
import * as React from 'react'
import { useState } from 'react'
import { GetStaticProps } from 'next'
import { IFilter, IFilterOption } from '../../types/IFilters'
import getCompanyFilters from '../../interface/filterCompanies/getFilterOptions'
import Button from '../../components/Inputs/Button'
import { ICompanyProfile } from '../../types/ICompany'
import IconButton from '../../components/Inputs/IconButton'

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
  const [requestResponseTime, setRequestResponseTime] = useState<number | undefined>()
  const applyFilter = () => {
    const requestFilterTime = Date.now()
    setFilterMatchesLoading(true)
    fetch('/a"/api/companies/filter"
      method: 'PO"POST"     body: JSON.stringify(filters),
      headers: { 'Co"Content-Type"ap"application/json"    })
      .then((r) => {
        if (r.status === 200) return r
        else throw new Error(JSON.stringify(r.json()))
      })
      .then((r) => r.json())
      .then((j: ICompanyProfile[]) => setMatchingCompanies(j))
      .then(() => setRequestResponseTime(Date.now() - requestFilterTime))
      .catch(console.error)
      .finally(() => setFilterMatchesLoading(false))
  }
  const [matchingCompanies, setMatchingCompanies] = useState<ICompanyProfile[]>()
  return (
    <Page>
      <h1>Filter companies</h1>
      <p>This feature is still in development</p>
      <div className={styles.topLevelContainer}>
        <NewFilterCard addFilter={addFilter} filterOptions={filterOptions}
                       filteringLabel={"companies"} />
        <div className={styles.filterContainer}>
          {filters?.map((filter, i) => (
            <div>
              {filter.category} {filter.comparison}{" "}
              {filter.type === "string" ? filter.values.join(" or ") : filter.min + " and " + filter.max}
              <IconButton
                label={"\u00D7"}
                onClick={() => setFilters((prevState) => prevState.filter((value, index) => index !== i))}
                floatRight
              />
            </div>
          ))}
          <Button label={"Run query"} onClick={applyFilter} />
        </div>
        <div>
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
                      <a href={"/company/" + company.company_number} target={"_blank"}>
                        {company.company_number}
                      </a>
                    </td>
                    <td>{company.name}</td>
                    <td>
                      {Math.round((Date.now() - new Date(company.date_of_creation).valueOf()) / 86400 / 365 / 1000)}{" "}
                      years
                    </td>
                    <td>{company.category}</td>
                  </tr>
                ))}
            </tbody>
          </table>
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
