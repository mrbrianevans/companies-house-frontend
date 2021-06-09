import { IStringFilter, IStringFilterOption } from '../../../types/IFilters'
import { IMinorQuery } from '../../../types/IQueries'
import { getSqlLikeValues } from '../../../helpers/getSqlLikeValues'

export const filterCompaniesBySicCode: (filter: IStringFilter) => IMinorQuery = (filter) => {
  const query = `
      SELECT company_number
      FROM sic
      WHERE sic.sic_code LIKE ANY (?)
  `
  const value = getSqlLikeValues(filter, true)
  return { query, value }
}

export const filterCompaniesBySicCodeMetadata: IStringFilterOption = {
  category: 'sic code',
  possibleComparisons: ['begins with', 'is exactly'],
  valueType: 'string',
  suggestions: ['10110', '24510', '93130'] //these should have human readable labels
}
