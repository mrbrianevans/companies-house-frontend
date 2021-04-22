import { IStringFilter } from '../../../types/IFilters'
import { IMinorQuery } from '../../../types/IQueries'
import { getSqlLikeValues } from '../../../helpers/getSqlLikeValues'

export const filterCompaniesBySicCodeDescription: (filter: IStringFilter) => IMinorQuery = (filter) => {
  const query = `
      SELECT s.company_number
      FROM sic_map m JOIN sic s ON m.code = s.sic_code
      WHERE upper(m.description) LIKE ANY (?)
  `
  const value = getSqlLikeValues(filter, true)
  return { query, value }
}

export const filterCompaniesBySicCodeDescriptionMetadata = {
  category: 'sic code description',
  possibleComparisons: ['includes', 'begins with', 'is exactly'],
  valueType: 'string',
  suggestions: ['retail', 'online', 'manufacture']
}
