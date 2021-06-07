import { IFilter, IFilterOption } from './IFilters'
import { IMinorQuery } from './IQueries'

export interface IFilterConfig {
  // the url of the api endpoint which returns the estimated count for a filter
  countResultsApiUrl: string
  // the url of the api endpoint which returns an ID for an array of filters
  getFilterIdApiUrl: string
  // a string to append the filter id to, and returns the frontend url to view it
  redirectUrl: string
  // the things you are filtering for, eg: companies, accountants
  labelPlural: string
  // the thing you are filtering for, eg: company, accountant
  labelSingular: string

  filters: { sqlGenerator: (filter: IFilter) => IMinorQuery; filterOption: IFilterOption }[]

  // the filters primary table from where results are returned
  main_table: string
  // a uniquely identifying column in the database table such as a company number, accountant name, or person number
  uniqueIdentifier: string
}
