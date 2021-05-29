import { IStringFilter, IStringFilterOption } from '../../../types/IFilters'
import { IMinorQuery } from '../../../types/IQueries'
import { getSqlLikeValues } from '../../../helpers/getSqlLikeValues'

export const filterAccountantsBySoftware: (filter: IStringFilter) => IMinorQuery = (filter) => {
  const query = `
      SELECT *
      FROM accountants
      WHERE lower(software) LIKE ANY (?)
  `
  const value = getSqlLikeValues(filter)
  return { query, value }
}

export const filterAccountantBySoftwareMetadata: IStringFilterOption = {
  category: 'production software',
  possibleComparisons: ['is exactly', 'includes', 'begins with'],
  valueType: 'string',
  suggestions: [
    'CCH Software',
    'IRIS Accounts Production',
    'Taxfiler',
    'Digita Accounts Production Advanced',
    'PTP Accounts Production',
    'Acorah Software Products - Accounts Production',
    'Sage Accounts Production 20.0 - FRS102_2019',
    'Caseware UK (AP4) 2019.0.227',
    'TVision DynamicsNAV Interface for Brookson Ltd'
  ]
}
