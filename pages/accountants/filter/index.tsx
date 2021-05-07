import { Page } from '../../../components/Page/Page'
import * as React from 'react'
import { useState } from 'react'
import { NewFilterCard } from '../../../components/NewFilterCard/NewFilterCard'
import { IFilter, IFilterOption } from '../../../types/IFilters'
import { GetStaticProps } from 'next'
import { IAccountant } from '../../../types/IAccountant'
import Button from '../../../components/Inputs/Button'
import IconButton from '../../../components/Inputs/IconButton'
import Link from 'next/link'
import getAccountantFilters from '../../../interface/filterAccountants/getFilterOptions'
import { useRouter } from 'next/router'

const styles = require('../../../styles/Accountant.module.scss')

interface Props {
  filterOptions: IFilterOption[]
}

const AccountantFilterPage = ({ filterOptions }: Props) => {
  const router = useRouter()
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
  let clearRequestResponseTimer: NodeJS.Timeout | undefined
  const applyFilter = () => {
    if (clearRequestResponseTimer) clearTimeout(clearRequestResponseTimer)
    setFilterMatchesLoading(true)
    fetch('/api/accountants/filterRedirect', {
      method: 'POST',
      body: JSON.stringify({ filters }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((r) => {
        if (r.status === 200) return r
        else throw new Error(r.statusText)
      })
      .then((r) => r.json())
      .then((j) => router.push('/accountants/filter/' + j.id))
  }
  const [matchingAccountants, setMatchingAccountants] = useState<IAccountant[]>()
  return (
    <Page>
      <h1>Accountants</h1>
      <div className={styles.filterContainer}>
        {showNewFilterForm && (
          <NewFilterCard addFilter={addFilter} filterOptions={filterOptions} filteringLabel={'accountants'} />
        )}
        {filters?.map((filter: IFilter, i) => (
          <div className={styles.card} style={{ width: '100%' }} key={i}>
            <h3>
              Filter {i + 1} - {filter.category}
              <IconButton
                floatRight
                label={'x'}
                onClick={() => setFilters((prevState) => prevState.filter((value, index) => index !== i))}
              />
            </h3>
            <p>
              {filter.exclude ? 'Exclude' : 'Only show'} accountants where {filter.category} {filter.comparison}{' '}
              {filter.type === 'number' ? filter.min + ' and ' + filter.max : filter.values.join(' or ')}
            </p>
          </div>
        ))}

        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {filters.length ? (
            <Button label={'Run query'} onClick={applyFilter} />
          ) : (
            <p>Apply at least 1 filter to run the query</p>
          )}
        </div>
        {filterMatchesLoading && (
          <div className={styles.card}>
            <h2>Loading...</h2>
          </div>
        )}
        {matchingAccountants && !filterMatchesLoading && (
          <div style={{ width: '100%' }} className={styles.card}>
            <h2>Filter results</h2>
            <pre>{requestResponseTime}ms response time</pre>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th />
                  <th>Name</th>
                  <th>Company Number</th>
                  <th>Location</th>
                  <th>Age</th>
                  <th>Software</th>
                  <th>Number of clients</th>
                </tr>
              </thead>
              <tbody>
                {matchingAccountants?.map((accountant, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ paddingRight: 20, paddingLeft: 0 }}>{index + 1}</span>
                    </td>
                    <td>
                      <Link href={'/accountants/' + encodeURIComponent(accountant.name_on_accounts)}>
                        <a target={'_blank'}>
                          {accountant.name_on_accounts
                            .split(' ')
                            .slice(0, accountant.name_on_accounts.split(' ').length - 1)
                            .join(' ')}
                        </a>
                      </Link>
                    </td>
                    <td>
                      <Link href={'/company/' + accountant.company_number}>
                        <a target={'_blank'}>{accountant.company_number}</a>
                      </Link>
                    </td>
                    <td>{accountant.area}</td>
                    <td>
                      {Math.round((Date.now() - new Date(accountant.date).valueOf()) / (86400 * 1000 * 365))} years
                    </td>
                    <td>{accountant.software.split(' ').slice(0, 3).join(' ')}</td>
                    <td>{accountant.number_of_clients}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Page>
  )
}

export default AccountantFilterPage

export const getStaticProps: GetStaticProps = async (context) => {
  const returnProps: Props = {
    filterOptions: getAccountantFilters()
  }
  return {
    props: returnProps
  }
}
