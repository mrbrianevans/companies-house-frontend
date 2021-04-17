import { IStringFilter } from '../../../types/IFilters'
import { IMinorQuery } from '../../../types/IQueries'
import { getSqlLikeValues } from '../../../helpers/getSqlLikeValues'

export const filterCompaniesByName: (filter: IStringFilter) => IMinorQuery = (filter) => {
  const query = `
      SELECT number AS company_number
      FROM companies
      WHERE upper(name) LIKE ANY (?)
  `
  const value = getSqlLikeValues(filter, true)
  return { query, value }
}

export const filterCompaniesByNameMetadata = {
  category: 'name',
  possibleComparisons: ['begins with', 'is exactly', 'includes', 'ends with'],
  valueType: 'string'
}
