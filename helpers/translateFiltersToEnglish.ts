import { IFilter } from '../types/IFilters'

export const translateFiltersToEnglish = (filters: IFilter[]) => {
  return filters
    .map((filter) => {
      if (filter.comparison === 'is between')
        return `${filter.category} ${filter.comparison} ${filter.min} and ${filter.max}`
      return `${filter.category} ${filter.comparison} ${filter.values.join(' or ')}`
    })
    .join(' and ')
}
