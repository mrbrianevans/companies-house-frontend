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
  const [filters, setFilters] = useState<IFilter[]>([])
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
    console.log('effect used with filter length:', filters?.length, 'router fallback:', router.isFallback)
    if (!router.isFallback) {
      // this means the client is on the right page
      // when a filter is added or removed, the new filter id is fetched, and then the client redirected to that filters page
      if (filters?.length > 0) {
        fetchGetFilterId({ filters: filters, category }).then((res) => {
          if (res.id !== savedFilter?.metadata?.id)
            return router.push(config.redirectUrl + res.id, config.redirectUrl + res.id, { scroll: false })
          else console.log('already on the right page. not redirecting')
        })
      } else {
        router.push(config.redirectUrl, config.redirectUrl, { scroll: false })
      }
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
    setFilters([filter, ...filters])
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
            // this is not ideal, because it will reset if a filter is removed (not good). Should depend on AddFilter
            resetWhenChanged={savedFilter?.metadata?.id}
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
