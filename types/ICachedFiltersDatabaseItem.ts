// generated typescript definitions from database using groovy script
import { FilterCategory } from './FilterCategory'

export interface ICachedFiltersDatabaseItem {
  id?: string
  last_viewed?: number
  view_count?: number
  created?: number
  last_run?: number
  time_to_run?: number[]
  filters?: Object[]
  query?: string
  category?: FilterCategory
  result_count?: number
}

export interface ICachedFiltersItem {
  id?: string
  lastViewed?: number
  viewCount?: number
  created?: number
  lastRun?: number
  timeToRun?: number[]
  filters?: Object[]
  query?: string
  category?: FilterCategory
  resultCount?: number
}

export function convertCachedFiltersDatabaseItemToItem(databaseItem: ICachedFiltersDatabaseItem): ICachedFiltersItem {
  const item = {
    id: databaseItem.id,
    lastViewed: databaseItem.last_viewed,
    viewCount: databaseItem.view_count,
    created: databaseItem.created,
    lastRun: databaseItem.last_run,
    timeToRun: databaseItem.time_to_run,
    filters: databaseItem.filters,
    query: databaseItem.query,
    category: databaseItem.category,
    resultCount: databaseItem.result_count
  }
  return item
}
