import { Page } from '../Page/Page'
import { IFilterValue, IFilterOption } from '../../types/IFilters'
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
import { FormatterRow } from 'fast-csv'
import FormRow from '../Inputs/FormRow'
import ButtonLink from '../Inputs/ButtonLink'
import { fetchCountResults } from '../../ajax/filter/countResults'
import { translateFiltersToEnglish } from '../../helpers/filters/translateFiltersToEnglish'
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
  const [filters, setFilters] = useState<IFilterValue[]>([])
  const [filterMatchesLoading, setFilterMatchesLoading] = useState<boolean>()
  const [filterMatches, setFilterMatches] = useState<ResultType[]>()
  const [newCountUpToDate, setCountUpToDate] = useState<boolean>()
  const [estimatedCount, setEstimatedCount] = useState<number>()
  const [executionTime, setExecutionTime] = useState<number>()
  const [userFilterId, setUserFilterId] = useState<number>()
  // this clears the current filter
  // this is probably not the best way, but I have wasted enough time trying to get this to work
  const [needsRedirect, setNeedsRedirect] = useState(false)
  useEffect(() => {
    // called when the saved filter (page prop) changes
    if (savedFilter?.appliedFilters !== undefined) {
      setFilters(savedFilter?.appliedFilters)

      if (typeof savedFilter?.metadata?.resultCount === 'number') {
        setEstimatedCount(savedFilter?.metadata?.resultCount)
        setCountUpToDate(true)
      } else {
        // fetch count from server
        setCountUpToDate(false)
        fetchCountResults({ filters: savedFilter?.appliedFilters, category }).then((res) => {
          if (!res?.count) return
          setEstimatedCount(res.count)
          setCountUpToDate(true)
        })
      }
    }
    setExecutionTime(savedFilter?.metadata?.lastRunTime)
    setUserFilterId(undefined)
    if (savedFilter?.metadata?.id) {
      //async get if the user has already saved this filter on page load
      fetchGetUserFilterId({ cachedFilterId: savedFilter?.metadata?.id }).then((r) => {
        if (typeof r?.userFilterId === 'number') setUserFilterId(r.userFilterId)
      })

      if (savedFilter?.results) {
        setFilterMatches(savedFilter.results)
      } else {
        setFilterMatchesLoading(true)
        fetchCacheResults<ResultType>({
          id: savedFilter.metadata.id,
          category,
          filters: savedFilter.appliedFilters ?? []
        }).then((res) => {
          if (res?.executionTime) setExecutionTime(res.executionTime)
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
      setNeedsRedirect(false)
      // when a filter is added or removed, the new filter id is fetched, and then the client redirected to that filters page
      if (filters?.length > 0) {
        setCountUpToDate(false)
        fetchCountResults({ filters, category }).then((res) => {
          if (!res?.count) return
          setEstimatedCount(res.count)
          setCountUpToDate(true)
        })
        fetchGetFilterId({ filters, category }).then((res) => {
          // this means the client isn't on the right page
          if (res && res.id !== savedFilter?.metadata?.id)
            return router.push(`/${config.urlPath}/filter/` + res.id, `/${config.urlPath}/filter/` + res.id, {
              scroll: false
            })
        })
      } else if (savedFilter?.metadata?.id) {
        router.push(`/${config.urlPath}/filter/`, `/${config.urlPath}/filter/`, { scroll: false })
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
  const addFilter = (filter: IFilterValue) => {
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
  const saveFilterToAccount = () => {
    if (!savedFilter) return
    fetchSaveUserFilter({ savedFilterId: savedFilter.metadata.id }).then((r) => {
      if (typeof r?.userFilterId === 'number') setUserFilterId(r.userFilterId)
    })
  }
  return (
    <Page>
      <h1 className={styles.title}>
        Filter {config.labelPlural}
        {savedFilter && (
          <>
            <Button
              label={
                userFilterId !== undefined
                  ? String.fromCharCode(0x2713) + ' Filter saved'
                  : String.fromCharCode(0x25bc) + ' Save this filter'
              }
              onClick={saveFilterToAccount}
            />
            {userFilterId !== undefined ? (
              <ButtonLink
                prefetch={false} // users are billed for these requests, so DO NOT prefetch
                href={'/api/filter/downloadCsv?id=' + userFilterId}
                aProps={{
                  target: '_blank',
                  download: 'companies-download.csv'
                }}>
                Download CSV
              </ButtonLink>
            ) : (
              <Button label={'Save to download'} buttonProps={{ disabled: true }} onClick={saveFilterToAccount} />
            )}
          </>
        )}
        {savedFilter && <ShareCode text={`filfa.co/${config.labelSingular.charAt(0)}/${savedFilter.metadata.id}`} />}
      </h1>
      <div className={styles.filterContainer}>
        {filterOptions !== undefined && (
          <NewFilterCard addFilter={addFilter} filterOptions={filterOptions} filteringLabel={config.labelPlural} />
        )}
        {filters !== undefined &&
          filters instanceof Array &&
          filters?.map((filter: IFilterValue, i) => (
            <div style={{ width: '100%' }} key={i}>
              <p className={styles.appliedFilter}>
                {translateFiltersToEnglish([filter])}
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
                    {estimatedCount === 1 ? 'matches' : 'match'} your filter{filters?.length !== 1 && 's'}
                  </span>
                )}
              </>
            ) : (
              <span>
                No {config.labelPlural} match your filter{filters?.length !== 1 && 's'}
              </span>
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
            <FormRow>
              <pre>Query executed in {executionTime / 1000} seconds</pre>
              {userFilterId !== undefined ? (
                <ButtonLink
                  prefetch={false} // users are billed for these requests, so DO NOT prefetch
                  href={'/api/filter/downloadCsv?id=' + userFilterId}
                  aProps={{
                    target: '_blank',
                    download: 'companies-download.csv'
                  }}>
                  Download CSV
                </ButtonLink>
              ) : (
                <Button label={'Save to download'} onClick={saveFilterToAccount} />
              )}
            </FormRow>
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
