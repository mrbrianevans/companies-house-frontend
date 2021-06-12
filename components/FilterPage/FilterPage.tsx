import { Page } from '../Page/Page'
import { IFilter, IFilterOption } from '../../types/IFilters'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { NewFilterCard } from '../NewFilterCard/NewFilterCard'
import IconButton from '../Inputs/IconButton'
import Button from '../Inputs/Button'
import { ICachedFilter } from '../../types/ICachedFilter'
import { ShareCode } from '../ShareCode/ShareCode'
import { formatApproximation } from '../../helpers/numberFormatter'
import { IFilterConfig } from '../../types/IFilterConfig'
import { FilterCategory } from '../../types/FilterCategory'
import { fetchGetFilterId } from '../../ajax/filter/getFilterId'
import { fetchSaveUserFilter } from '../../ajax/user/saveUserFilter'
import { fetchGetUserFilterId } from '../../ajax/user/getUserFilterId'
import { fetchCacheResults } from '../../ajax/filter/cacheResults'
import { GenericSearchBar } from '../SearchBars/GenericSearchBar'
import { GenericResultsTable } from './ResultsTables/GenericResultsTable'
import { LoadingIcon } from '../LoadingIcon/LoadingIcon'
const styles = require('./FilterPage.module.scss')

interface Props<ResultType> {
  filterOptions?: IFilterOption[]
  ResultsTable?: React.FC<{ matchingResults: ResultType[]; tableClassName: any }>
  config: IFilterConfig
  category: FilterCategory
  savedFilter?: ICachedFilter<ResultType>
}

export const FilterPage = <ResultType extends object>({
  savedFilter,
  filterOptions,
  config,
  category,
  ResultsTable
}: Props<ResultType>) => {
  const router = useRouter()
  const [filters, setFilters] = useState<IFilter[]>([])
  const [filterMatchesLoading, setFilterMatchesLoading] = useState<boolean>()
  const [filterMatches, setFilterMatches] = useState<ResultType[]>()
  const [newCountUpToDate, setCountUpToDate] = useState<boolean>()
  const [estimatedCount, setEstimatedCount] = useState<number>()
  const [executionTime, setExecutionTime] = useState<number>()
  // this clears the current filter
  // this is probably not the best way, but I have wasted enough time trying to get this to work
  const [needsRedirect, setNeedsRedirect] = useState(false)
  const [filterSaved, setFilterSaved] = useState(false)
  useEffect(() => {
    if (savedFilter?.appliedFilters !== undefined) {
      setFilters(savedFilter?.appliedFilters)
    }
    setExecutionTime(savedFilter?.metadata?.lastRunTime)
    if (savedFilter?.metadata?.id) {
      //async get if the user has already saved this filter on page load
      fetchGetUserFilterId({ cachedFilterId: savedFilter?.metadata?.id }).then((re) => setFilterSaved(re?.userFilterId))

      if (savedFilter?.results) {
        setFilterMatches(savedFilter.results)
      } else {
        setFilterMatchesLoading(true)
        fetchCacheResults<ResultType>({
          id: savedFilter.metadata.id,
          category,
          filters: savedFilter.appliedFilters ?? []
        }).then((res) => {
          if (res.executionTime) setExecutionTime(res.executionTime)
          setFilterMatches(res?.results)
          setFilterMatchesLoading(false)
        })
      }
    }
  }, [savedFilter])
  useEffect(() => {
    if (!router.isFallback) {
      setFilterMatchesLoading(false)
      setFilters(savedFilter?.appliedFilters ?? [])
    }
  }, [router.isFallback, router.asPath])
  useEffect(() => {
    if (!router.isFallback && needsRedirect) {
      // when a filter is added or removed, the new filter id is fetched, and then the client redirected to that filters page
      if (filters?.length > 0) {
        fetchGetFilterId({ filters: filters, category }).then((res) => {
          setNeedsRedirect(false)
          // this means the client isn't on the right page
          if (res.id !== savedFilter?.metadata?.id)
            return router.push(config.redirectUrl + res.id, config.redirectUrl + res.id, { scroll: false })
        })
      } else if (savedFilter?.metadata?.id) {
        router.push(config.redirectUrl, config.redirectUrl, { scroll: false })
      }
    }
  }, [filters])
  if (router.isFallback) {
    return (
      // todo: this needs to be a better loading page...
      <Page>
        <h1>loading</h1>
      </Page>
    )
  }
  const addFilter = (filter: IFilter) => {
    setNeedsRedirect(true)
    setFilterMatches(undefined)
    setFilters([filter, ...(filters ?? [])])
  }
  const removeFilter = (i: number) => {
    if (filters.length <= i) return
    setNeedsRedirect(true)
    setFilterMatches(undefined)
    setFilters((prevState) => prevState.filter((value, index) => index !== i))
  }
  const applyFilter = () => {
    setFilterMatchesLoading(true)
    fetchGetFilterId({ filters, category }).then((fi) => {
      if (!fi) return // failed to get id. Need an error message somewhere
      if (fi.id !== savedFilter?.metadata.id)
        return router.push(config.redirectUrl + fi.id, config.redirectUrl + fi.id, { scroll: false })
      else setFilterMatchesLoading(false)
    })
  }
  const saveFilterToAccount = () => {
    fetchSaveUserFilter({ savedFilterId: savedFilter.metadata.id }).then((r) => setFilterSaved(Boolean(r)))
  }
  return (
    <Page>
      <h1 className={styles.title}>
        Filter {config.labelPlural}
        <Button
          label={
            filterSaved
              ? String.fromCharCode(0x2713) + ' Filter saved'
              : String.fromCharCode(0x25bc) + ' Save this filter'
          }
          onClick={saveFilterToAccount}
        />
        {savedFilter && <ShareCode text={`filfa.co/${config.labelSingular.charAt(0)}/${savedFilter.metadata.id}`} />}
      </h1>
      <div className={styles.filterContainer}>
        {filterOptions !== undefined && (
          <NewFilterCard addFilter={addFilter} filterOptions={filterOptions} filteringLabel={config.labelPlural} />
        )}
        {filters !== undefined &&
          filters instanceof Array &&
          filters?.map((filter: IFilter, i) => (
            <div style={{ width: '100%' }} key={i}>
              <p className={styles.appliedFilter}>
                {filter.category} {filter.comparison}{' '}
                {filter.type === 'number' ? filter.min + ' and ' + filter.max : filter.values.join(' or ')}
                <IconButton label={'x'} onClick={() => removeFilter(i)} />
              </p>
            </div>
          ))}
        <h2>Filter results</h2>
        <div className={styles.runQuery}>
          {filters?.length ? (
            estimatedCount !== 0 ? (
              <>
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
            <LoadingIcon />
          </div>
        )}

        {filterMatches !== undefined && filterMatches !== null && (
          <div style={{ width: '100%' }}>
            <pre>Query executed in {executionTime / 1000} seconds</pre>
            {filterMatches?.length > 0 ? (
              <div className={styles.resultsScrollableContainer}>
                {ResultsTable ? (
                  <ResultsTable matchingResults={filterMatches} tableClassName={styles.resultsTable} />
                ) : (
                  <GenericResultsTable<ResultType>
                    matchingResults={filterMatches}
                    tableClassName={styles.resultsTable}
                    cachedFilter={savedFilter}
                    filterConfig={config}
                  />
                )}
              </div>
            ) : (
              <p>Zero results</p>
            )}

            {['role'] === ['developer'] && <pre>{JSON.stringify(filterMatches, null, 2)}</pre>}
          </div>
        )}
      </div>
    </Page>
  )
}
