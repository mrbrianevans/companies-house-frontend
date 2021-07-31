import { IFilterConfig } from '../types/IFilterConfig'

export const officerFilterConfig: IFilterConfig = {
  urlPath: 'officers',
  filters: [
    {
      filterOption: { category: 'age', possibleComparisons: ['is between'], valueType: 'number' },
      sqlGenerator: (filter) => ({ value: [], query: '' })
    }
  ],
  labelPlural: 'officers',
  labelSingular: 'officer',
  main_table: 'person_officers',
  operation_code: 'download_officer_records',
  redirectUrl: '/officers/filter/',
  uniqueIdentifier: 'person_number',
  viewItemUrl: '/officers/'
}
