import { IFilter, IFilterOption } from '../../../types/IFilters'
import { IAccountant } from '../../../types/IAccountant'
import { useEffect, useState } from 'react'
import { Page } from '../../../components/Page/Page'
import { NewFilterCard } from '../../../components/NewFilterCard/NewFilterCard'
import IconButton from '../../../components/Inputs/IconButton'
import Button from '../../../components/Inputs/Button'
import Link from 'next/link'
import * as React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { getSavedFilter } from '../../../interface/filterAccountants/getSavedFilter'
import getAccountantFilters from '../../../interface/filterAccountants/getFilterOptions'

const styles = require('../../../styles/Accountant.module.scss')

interface Props {
  filterOptions?: IFilterOption[]
  appliedFilters?: IFilter[]
  results?: IAccountant[]
  metadata?: { id: string; name?: string; created: number; lastRun: number }
}
const AccountantFilterPage = ({ appliedFilters, filterOptions, metadata, results }: Props) => {
  const router = useRouter()

  // console.log('props: ', { appliedFilters, filterOptions, metadata, results })
  const [showNewFilterForm, setShowNewFilterForm] = useState<boolean>()
  const [filters, setFilters] = useState<IFilter[]>()
  const [filterMatchesLoading, setFilterMatchesLoading] = useState<boolean>()
  const [requestResponseTime, setRequestResponseTime] = useState<number | undefined>()
  const [matchingAccountants, setMatchingAccountants] = useState<IAccountant[]>()
  useEffect(() => {
    if (router.isFallback) console.log('ON A FALLBACK PAGE!', Date.now(), router.asPath)
    else console.log('not on a fallback page', Date.now(), router.asPath)
    if (!router.isFallback) {
      setMatchingAccountants(results)
      setShowNewFilterForm(filterOptions.length > 0) // this should always be true
      setFilterMatchesLoading(false)
      setFilters(appliedFilters)
    }
  }, [router.isFallback, router.asPath])
  let clearRequestResponseTimer: NodeJS.Timeout | undefined
  if (router.isFallback) {
    return (
      // todo: this needs to be a better loading page...
      <Page>
        <h1>loading</h1>
      </Page>
    )
  }
  const addFilter = (filter: IFilter) => {
    setShowNewFilterForm(false)
    setFilters((prevState) => [filter, ...prevState])
    setTimeout(() => {
      setShowNewFilterForm(true)
    }, 1)
  }
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
          {filters?.length ? (
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
  const { id } = context.params
  if (typeof id !== 'string') {
    return {
      notFound: true
    }
  }
  console.log('filter with id: ', id, 'requested')
  const savedFilter = await getSavedFilter(id)
  if (savedFilter === null) {
    return {
      notFound: true
    }
  }
  const returnProps: Props = {
    filterOptions: getAccountantFilters(),
    appliedFilters: savedFilter.filters,
    results: savedFilter.results,
    metadata: { id, created: savedFilter.created, lastRun: savedFilter.lastRun }
  }
  return {
    props: returnProps,
    revalidate: 86400 // extract to environment or global variable
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  }
}
