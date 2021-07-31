import { IFilterValue } from './IFilters'
import { IAccountant } from './IAccountant'

export interface ICachedFilter<ResultType> {
  appliedFilters: IFilterValue[]
  results: ResultType[]
  metadata: FilterMetadata
}

export interface FilterMetadata {
  id: string
  name?: string
  // timestamp in ms when this filter was first saved
  created: number
  // timestamp of the last time this query was run
  lastRun: number
  // the time taken to query this filter (the most recent run)
  lastRunTime: number
  viewCount: number
  resultCount: number
}
