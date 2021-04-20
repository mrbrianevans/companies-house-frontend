import { INumberFilter } from '../../../types/IFilters'
import { IMinorQuery } from '../../../types/IQueries'

export const filterCompaniesByAge: (filter: INumberFilter) => IMinorQuery = (filter) => {
  const query = `
      SELECT number AS company_number
      FROM companies
      WHERE date BETWEEN CURRENT_DATE - (?::TEXT||' years')::INTERVAL
                AND CURRENT_DATE - (?::TEXT||' years')::INTERVAL
  `

  return { query, value: [filter.max, filter.min] }
}

export const filterCompaniesByAgeMetadata = {
  category: 'age',
  possibleComparisons: ['is between'],
  valueType: 'number'
}
