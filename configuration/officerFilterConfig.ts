import { IFilterConfig } from '../types/IFilterConfig'
import { FilterComparison } from './filterComparisons'

export const officerFilterConfig: IFilterConfig = {
  urlPath: 'officer',
  filters: [
    {
      columnName: 'birth_date',
      dataType: 'date',
      field: 'date of birth',
      possibleComparisons: [FilterComparison.AFTER, FilterComparison.BEFORE, FilterComparison.IS_BETWEEN]
    },
    {
      columnName: 'forenames',
      dataType: 'string',
      field: 'first name',
      possibleComparisons: [FilterComparison.MATCHES]
    },
    {
      columnName: 'height',
      dataType: 'number',
      field: 'height in cm',
      possibleComparisons: [FilterComparison.GREATER_THAN, FilterComparison.LESS_THAN, FilterComparison.IS_BETWEEN]
    }
  ],
  labelPlural: 'officers',
  labelSingular: 'officer',
  main_table: 'person_officers',
  operation_code: 'download_officer_records',
  uniqueIdentifier: 'person_number',
  viewItemUrl: '/officer/'
}
