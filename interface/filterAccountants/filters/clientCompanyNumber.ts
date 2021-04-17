import { IStringFilter } from '../../../types/IFilters'
import { IMinorQuery } from '../../../types/IQueries'

export const filterAccountantsByClientCompanyNumber: (filter: IStringFilter) => IMinorQuery = (filter) => {
  const query = `
      SELECT a.*
      FROM wide_accounts_combined wac
               JOIN
           accountants a ON wac.accountants = a.name_on_accounts
      WHERE wac.company_number = ANY (?)
  `
  const value = [filter.values]
  return { query, value }
}

export const filterAccountantsByClientCompanyNumberMetadata = {
  category: 'client company number',
  possibleComparisons: ['is exactly'],
  valueType: 'string'
}
