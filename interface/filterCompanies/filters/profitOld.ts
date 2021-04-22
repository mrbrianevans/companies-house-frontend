import { IFilterOption, INumberFilter } from '../../../types/IFilters'
import { IMinorQuery } from '../../../types/IQueries'

export const filterCompaniesByProfit: (filter: INumberFilter) => IMinorQuery = (filter) => {
  const query = `
      SELECT company_number
      FROM wide_accounts_combined
      WHERE profit BETWEEN ? AND ?
  `

  return { query, value: [filter.min, filter.max] }
}

export const filterCompaniesByProfitMetadata: IFilterOption = {
  category: 'profit',
  possibleComparisons: ['is between'],
  valueType: 'number'
}
