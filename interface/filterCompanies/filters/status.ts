import { IFilterOption, IStringFilter } from '../../../types/IFilters'
import { IMinorQuery } from '../../../types/IQueries'
import { getSqlLikeValues } from '../../../helpers/getSqlLikeValues'

export const filterCompaniesByStatus: (filter: IStringFilter) => IMinorQuery = (filter) => {
  const query = `
      SELECT number AS company_number
      FROM companies
      WHERE upper(status) LIKE ANY (?)
  `
  const value = getSqlLikeValues(filter, true)
  return { query, value }
}

export const filterCompaniesByStatusMetadata: IFilterOption = {
  category: 'status',
  possibleComparisons: ['is exactly', 'includes'],
  valueType: 'string',
  suggestions: ['active', 'dissolved', 'liquidation', 'active - proposal to strike off', 'in administration']
}
