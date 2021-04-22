// FILE GENERATED BY generator.js
import { IFilterOption, INumberFilter } from '../../../types/IFilters'
import { IMinorQuery } from '../../../types/IQueries'

export const filterCompaniesByEmployees: (filter: INumberFilter) => IMinorQuery = (filter) => {
  const query = `
      SELECT company_number
      FROM wide_accounts_combined
      WHERE employees BETWEEN ? AND ?
  `

  return { query, value: [filter.min, filter.max] }
}

export const filterCompaniesByEmployeesMetadata: IFilterOption = {
  category: 'employees',
  possibleComparisons: ['is between'],
  valueType: 'number'
}
