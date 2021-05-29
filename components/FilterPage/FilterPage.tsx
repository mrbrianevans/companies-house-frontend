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
import ButtonLink from '../Inputs/ButtonLink'
import { formatApproximation } from '../../helpers/numberFormatter'
import { IFilterConfig } from '../../types/IFilterConfig'
const styles = require('./FilterPage.module.scss')

interface Props<ResultType> {
  filterOptions?: IFilterOption[]
  ResultsTable?: React.FC<{ matchingResults: ResultType[]; tableClassName: any }>
  config: IFilterConfig
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
  const [newFilterId, setNewFilterId] = useState<string>()
  const [newFilterIdUpToDate, setNewFilterIdUpToDate] = useState<boolean>()
  const [newCountUpToDate, setCountUpToDate] = useState<boolean>()
  const [estimatedCount, setEstimatedCount] = useState<number>()
  //todo: async get if the user has already saved this filter on page load
  const [saveMessage, setSaveMessage] = useState<string>()
  useEffect(() => {
    if (!router.isFallback) {
      setShowNewFilterForm(filterOptions?.length > 0) // this should always be true
      setFilterMatchesLoading(false)
      setFilters(savedFilter?.appliedFilters ?? [])
    }
  }, [router.isFallback, router.asPath])
  useEffect(() => {
    if (filters?.length > 0) {
      setNewFilterIdUpToDate(false)
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
          setNewFilterId(config.redirectUrl + j.id)
          setNewFilterIdUpToDate(true)
        })
      setCountUpToDate(false)
      fetch(config.countResultsApiUrl, {
        method: 'POST',
        body: JSON.stringify({ filters }),
        headers: { 'Content-Type': 'application/json' }
      })
        .then((r) => {
          if (r.status === 200) return r.json()
          else throw new Error(r.statusText)
        })
        .then((j) => setEstimatedCount(Number(j.count)))
        .then(() => setCountUpToDate(true))
    } else {
      // this is useless because the button is hidden
      setNewFilterId(config.redirectUrl)
      setNewFilterIdUpToDate(true)
    }
  }, [filters])
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
      .then((j) => {
        if (j.id !== savedFilter?.metadata.id)
          return router.push(config.redirectUrl + j.id, config.redirectUrl + j.id, { scroll: false })
        else setFilterMatchesLoading(false)
      })
      .catch(console.error)
  }
  const saveFilterToAccount = () => {
    fetch(`/api/filter/saveFilterToAccount`, {
      method: 'PUT',
      body: JSON.stringify({ id: savedFilter.metadata.id, category: config.labelSingular.toUpperCase() }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((r) => {
        if (r.status === 200) return r
        else throw new Error(r.statusText)
      })
      .then((r) => r.json())
      .then((j) => {
        // j.id is the ID of the saved filter
        setSaveMessage('Filter saved')
        // setTimeout(() => setSaveMessage(undefined), 3000)
        // return router.push('/account/savedFilters/' + j.id)
      })
      .catch(console.error)
  }
  return (
    <Page>
      <h1 className={styles.title}>
        Filter {config.labelPlural}
        <Button
          label={saveMessage ?? String.fromCharCode(0x25bc) + ' Save this filter'}
          onClick={saveFilterToAccount}
        />
        {savedFilter && <ShareCode text={`filfa.co/${config.labelSingular.charAt(0)}/${savedFilter.metadata.id}`} />}
      </h1>
      <div className={styles.filterContainer}>
        {showNewFilterForm && filterOptions !== undefined && (
          <NewFilterCard addFilter={addFilter} filterOptions={filterOptions} filteringLabel={config.labelPlural} />
        )}
        {filters?.map((filter: IFilter, i) => (
          <div style={{ width: '100%' }} key={i}>
            <p className={styles.appliedFilter}>
              {filter.category} {filter.comparison}{' '}
              {filter.type === 'number' ? filter.min + ' and ' + filter.max : filter.values.join(' or ')}
              <IconButton
                label={'x'}
                onClick={() => setFilters((prevState) => prevState.filter((value, index) => index !== i))}
              />
            </p>
          </div>
        ))}
        <h2>Filter results</h2>
        <div className={styles.runQuery}>
          {filters?.length ? (
            estimatedCount !== 0 ? (
              <>
                {newFilterIdUpToDate ? (
                  <ButtonLink href={newFilterId} scroll={false} label={'Run query'} />
                ) : (
                  <Button label={'Run query'} onClick={applyFilter} />
                )}
                {newCountUpToDate && (
                  <span className={styles.estimatedCount}>
                    {estimatedCount !== 1 && 'Approximately '}
                    {formatApproximation(estimatedCount)}{' '}
                    {estimatedCount === 1 ? config.labelSingular : config.labelPlural}{' '}
                    {estimatedCount === 1 ? 'matches' : 'match'} your filter{filters.length !== 1 && 's'}
                  </span>
                )}
              </>
            ) : (
              <span>No {config.labelPlural} match your filters</span>
            )
          ) : (
            <p>Apply at least 1 filter to run the query</p>
          )}
        </div>
        {filterMatchesLoading && (
          <div>
            <h2>Loading...</h2>
          </div>
        )}

        {savedFilter?.results?.length > 0 && !filterMatchesLoading && (
          <div style={{ width: '100%' }}>
            <pre>Query executed in {savedFilter.metadata.lastRunTime}ms</pre>
            <ResultsTable matchingResults={savedFilter.results} tableClassName={styles.resultsTable} />
          </div>
        )}
      </div>
    </Page>
  )
}
