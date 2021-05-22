import { ISavedFilter } from './ISavedFilter'
import { IUserFilter } from './IUserFilter'
import { IFilter } from './IFilters'

// join user filter on saved filter
export interface ICombinedSavedFilter {
  user_saved_id: number
  saved_filter_fk: string
  title?: null | string
  saved_date: string
  user_id: number
  category: 'COMPANY' | 'ACCOUNTANT'
  last_viewed: string
  view_count: number
  last_run: string
  time_to_run: number[]
  filters: IFilter[]
  query: string
  results: {
    name: string
    category: string
    company_number: string
    date_of_creation: string
  }[]
  result_count: number
}
