import { IStringFilter } from '../types/IFilters'

export const getSqlLikeValues = (filter: IStringFilter, uppercase = false) => {
  const changeCase = (value: string) => {
    if (uppercase) return value.toUpperCase()
    return value.toLowerCase()
  }

  return [
    filter.values.map((value) => {
      switch (filter.comparison) {
        case 'begins with':
          return changeCase(value) + '%'
        case 'ends with':
          return '%' + changeCase(value)
        case 'includes':
          return '%' + changeCase(value) + '%'
        case 'is exactly':
          return changeCase(value)
      }
    })
  ]
}
