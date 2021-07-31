import { IFilterConfig } from '../types/IFilterConfig'

export const officerFilterConfig: IFilterConfig = {
  urlPath: 'officer',
  filters: [
    {
      filterOption: { category: 'age', possibleComparisons: ['is between'], valueType: 'number' },
      sqlGenerator: (filter) => ({
        value: filter.type === 'number' ? [filter.min, filter.max] : [],
        query: `SELECT * FROM person_officers WHERE EXTRACT(YEAR FROM current_date) - EXTRACT(YEAR FROM birth_date) BETWEEN ? AND ?`
      })
    }
  ],
  labelPlural: 'officers',
  labelSingular: 'officer',
  main_table: 'person_officers',
  operation_code: 'download_officer_records',
  redirectUrl: '/officer/filter/',
  uniqueIdentifier: 'person_number',
  viewItemUrl: '/officer/'
}
