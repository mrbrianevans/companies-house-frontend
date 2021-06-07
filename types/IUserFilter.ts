import { IFilter } from './IFilters'

export interface IUserFilter {
  id: number
  // references the filter_id in the saved_filters table
  cached_filter_fk: string
  // a user input title to describe the filter
  title?: string | null
  // a timestamp of when this filter was first saved by the user
  created: string
  // references the user id in the users table
  user_id_fk: number
  category: 'ACCOUNTANT' | 'COMPANY'
  // (optional) the filter object of the applied filters
  filters: IFilter[]
}

// the filter info to display to the user
export interface IUserFilterDisplay {
  // a rendering of the filter to plain english
  english: string
  // timestamp of when the user saved the filter
  dateSaved: number
  cachedFilterId: string
  category: 'ACCOUNTANT' | 'COMPANY'
  // the relative url from root/ to the filter
  urlToFilter: string
  // the id in user_filters
  userFilterId: string
  // total results from this filter (no limits)
  resultCount: number
}
