import { Page } from '../Page/Page'
import { IFilter, IFilterOption } from '../../types/IFilters'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { NewFilterCard } from '../NewFilterCard/NewFilterCard'
import IconButton from '../Inputs/IconButton'
import Button from '../Inputs/Button'
import { ISavedFilter } from '../../types/ISavedFilter'
import { ShareCode } from '../ShareCode/ShareCode'
import ButtonLink from '../Inputs/ButtonLink'
import { formatApproximation } from '../../helpers/numberFormatter'
import { IFilterConfig } from '../../types/IFilterConfig'
import { FilterCategory } from '../../types/FilterCategory'
import { fetchCountResults } from '../../ajax/filter/countResults'
import { fetchCacheFilter } from '../../ajax/filter/cacheFilter'
import { fetchGetFilterId } from '../../ajax/filter/getFilterId'
import { fetchSaveUserFilter } from '../../ajax/user/saveUserFilter'
const styles = require('./FilterPage.module.scss')

interface Props<ResultType> {
  filterOptions?: IFilterOption[]
  ResultsTable?: React.FC<{ matchingResults: ResultType[]; tableClassName: any }>
  config: IFilterConfig
  category: FilterCategory
  savedFilter?: ISavedFilter<ResultType>
}

export const FilterPage = <ResultType extends object>({
  savedFilter,
  filterOptions,
  config,
  category,
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
      fetchGetFilterId({ filters, category }).then((fi) => {
        if (!fi) return // failed to get id. Need an error message somewhere
        setNewFilterId(config.redirectUrl + fi.id)
        setNewFilterIdUpToDate(true)
        const daysStaleRevalidate = 1
        // run the filter if it hasn't been run in the last day
        if (!fi.lastRun || fi.lastRun < Date.now() - 1000 * 86400 * daysStaleRevalidate)
          fetchCacheFilter({ filters, category })
      })
      setCountUpToDate(false)
      fetchCountResults({ filters, category })
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
    fetchGetFilterId({ filters, category }).then((fi) => {
      if (!fi) return // failed to get id. Need an error message somewhere
      if (fi.id !== savedFilter?.metadata.id)
        return router.push(config.redirectUrl + fi.id, config.redirectUrl + fi.id, { scroll: false })
      else setFilterMatchesLoading(false)
    })
  }
  const saveFilterToAccount = () => {
    fetchSaveUserFilter({ savedFilterId: savedFilter.metadata.id }).then((r) => {
      if (r) setSaveMessage('Filter saved')
      else setSaveMessage('Failed to save')
    })
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
          <NewFilterCard
            addFilter={addFilter}
            filterOptions={filterOptions}
            filteringLabel={config.labelPlural}
            onChange={() => {
              console.time('get filter id onChange')
              fetchGetFilterId({ filters, category }).then((res) => {
                console.timeEnd('get filter id onChange')
                // console.log('Got an id of ' + res.id)
              })
              // console.log('filter changed. call getFilterId and make "Add filter" button a link to that ID')
            }}
            onHoverAdd={() => {
              console.time('get filter id onHover ')
              fetchGetFilterId({ filters, category }).then(() => console.timeEnd('get filter id onHover '))
              // console.log('hover over button. perhaps call cacheFilter in anticipation of click')
            }}
          />
        )}
        {filters !== undefined &&
          filters instanceof Array &&
          filters?.map((filter: IFilter, i) => (
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
