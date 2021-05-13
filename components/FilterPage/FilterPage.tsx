import { Page } from '../Page/Page'
import { IFilter, IFilterOption } from '../../types/IFilters'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { NewFilterCard } from '../NewFilterCard/NewFilterCard'
import IconButton from '../Inputs/IconButton'
import Button from '../Inputs/Button'
import * as React from 'react'
import { ISavedFilter } from '../../types/ISavedFilter'
import { ShareCode } from '../ShareCode/ShareCode'
const styles = require('./FilterPage.module.scss')

interface Config {
  // the url of the api endpoint which returns an ID for an array of filters
  getFilterIdApiUrl: string
  // a function which takes a filter id, and returns the frontend url to view it
  redirectUrl: (id: string) => string
  // the things you are filtering for, eg: companies, accountants
  labelPlural: string
  // the thing you are filtering for, eg: company, accountant
  labelSingular: string
}
interface Props<ResultType> {
  filterOptions?: IFilterOption[]
  ResultsTable?: React.FC<{ matchingResults: ResultType[]; tableClassName: any }>
  config: Config
  savedFilter?: ISavedFilter<ResultType>
}

export const FilterPage = <ResultType extends object>({
  savedFilter,
  filterOptions,
  config,
  ResultsTable
}: Props<ResultType>) => {
  const router = useRouter()
  const [showNewFilterForm, setShowNewFilterForm] = useState<boolean>()
  const [filters, setFilters] = useState<IFilter[]>()
  const [filterMatchesLoading, setFilterMatchesLoading] = useState<boolean>()
  useEffect(() => {
    if (!router.isFallback) {
      setShowNewFilterForm(filterOptions?.length > 0) // this should always be true
      setFilterMatchesLoading(false)
      setFilters(savedFilter?.appliedFilters ?? [])
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
    fetch(config.getFilterIdApiUrl, {
      method: 'POST',
      body: JSON.stringify({ filters }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((r) => {
        if (r.status === 200) return r
        else throw new Error(r.statusText)
      })
      .then((r) => r.json())
      .then(async (j) => {
        if (j.id !== savedFilter?.metadata.id) await router.push(config.redirectUrl(j.id))
        else setFilterMatchesLoading(false)
      })
      .catch(console.error)
  }
  return (
    <Page>
      <h1>Filter {config.labelPlural}</h1>
      <div className={styles.filterContainer}>
        {savedFilter && (
          <div>
            Share filter!
            <ShareCode text={'filfa.co/' + savedFilter.metadata.id} />
          </div>
        )}
        {showNewFilterForm && filterOptions !== undefined && (
          <NewFilterCard addFilter={addFilter} filterOptions={filterOptions} filteringLabel={config.labelPlural} />
        )}
        {filters?.map((filter: IFilter, i) => (
          <div style={{ width: '100%' }} key={i}>
            <h3>
              Filter {i + 1} - {filter.category}
              <IconButton
                floatRight
                label={'x'}
                onClick={() => setFilters((prevState) => prevState.filter((value, index) => index !== i))}
              />
            </h3>
            <p>
              {filter.exclude ? 'Exclude' : 'Only show'} {config.labelPlural} where {filter.category}{' '}
              {filter.comparison}{' '}
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
          <div>
            <h2>Loading...</h2>
          </div>
        )}
        {savedFilter?.results && !filterMatchesLoading && (
          <div style={{ width: '100%' }}>
            <h2>Filter results</h2>
            <pre>{savedFilter.metadata.lastRunTime}ms response time</pre>
            <ResultsTable matchingResults={savedFilter.results} tableClassName={styles.resultsTable} />
          </div>
        )}
      </div>
    </Page>
  )
}
