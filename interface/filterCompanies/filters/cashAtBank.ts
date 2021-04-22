// FILE GENERATED BY generator.js
import { IFilterOption, INumberFilter } from '../../../types/IFilters'
import { IMinorQuery } from '../../../types/IQueries'

export const filterCompaniesByCashAtBank: (filter: INumberFilter) => IMinorQuery = (filter) => {
  const query = `
      SELECT company_number
      FROM wide_accounts_combined
      WHERE cash_at_bank BETWEEN ? AND ?
  `

  return { query, value: [filter.min, filter.max] }
}

export const filterCompaniesByCashAtBankMetadata: IFilterOption = {
  category: 'cash at bank',
  possibleComparisons: ['is between'],
  valueType: 'number'
}
