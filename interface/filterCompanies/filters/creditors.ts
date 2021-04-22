// FILE GENERATED BY generator.js
import { IFilterOption, INumberFilter } from '../../../types/IFilters'
import { IMinorQuery } from '../../../types/IQueries'

export const filterCompaniesByCreditors: (filter: INumberFilter) => IMinorQuery = (filter) => {
  const query = `
      SELECT company_number
      FROM wide_accounts_combined
      WHERE creditors BETWEEN ? AND ?
  `

  return { query, value: [filter.min, filter.max] }
}

export const filterCompaniesByCreditorsMetadata: IFilterOption = {
  category: 'creditors',
  possibleComparisons: ['is between'],
  valueType: 'number'
}
