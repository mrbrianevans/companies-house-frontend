import { IStringFilter } from '../../../types/IFilters'
import { IMinorQuery } from '../../../types/IQueries'
import { getSqlLikeValues } from '../../../helpers/getSqlLikeValues'

export const filterAccountantsByName: (filter: IStringFilter) => IMinorQuery = (filter) => {
  const query = `
      SELECT *
      FROM accountants
      WHERE lower(name_on_accounts) LIKE ANY (?)
  `
  const value = getSqlLikeValues(filter)
  return { query, value }
}

export const filterAccountantsByNameMetadata = {
  category: 'name',
  possibleComparisons: ['begins with', 'is exactly', 'includes', 'ends with'],
  valueType: 'string'
}
