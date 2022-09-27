import { IFilterConfig } from '../types/IFilterConfig'
import { personOfficersFilters } from './filters/personOfficersFilters'

export const officerFilterConfig: IFilterConfig = Object.freeze({
  urlPath: 'officer',
  labelPlural: 'officers',
  labelSingular: 'officer',
  main_table: 'person_officers',
  operation_code: 'download_officer_records',
  uniqueIdentifier: 'person_number',
  viewItemUrl: '/officer/',
  filters: personOfficersFilters
})
