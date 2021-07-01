import { INumberFilter, INumberFilterOption } from '../../../types/IFilters'
import { IMinorQuery } from '../../../types/IQueries'

export const filterAccountantsByNumberOfClients: (filter: INumberFilter) => IMinorQuery = (filter) => {
  const query = `
      SELECT *
      FROM accountants
      WHERE accountants.number_of_clients BETWEEN ? AND ?
  `
  const value = [filter.min, filter.max]
  return { query, value }
}

export const filterAccountantsByNumberOfClientsMetdata: INumberFilterOption = {
  category: 'number of clients',
  possibleComparisons: ['is between'],
  valueType: 'number'
}
