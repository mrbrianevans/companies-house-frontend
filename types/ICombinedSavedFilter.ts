import { IFilter } from './IFilters'

// join user filter on saved filter
export interface ICombinedSavedFilter {
  user_saved_id: number
  cached_filter_fk: string
  title?: null | string
  //timestamp in ms
  saved_date: number
  user_id: number
  category: 'COMPANY' | 'ACCOUNTANT'
  //timestamp in ms
  last_viewed: number
  view_count: number
  //timestamp in ms
  last_run: number
  time_to_run: number[]
  filters: IFilter[]
  query: string
  result_count: number
}
