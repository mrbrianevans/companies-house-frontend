import { IFilterOption } from './IFilters'

export interface IFilterConfig {
  /** The top level path in the URL of the UI for this category.
   *
   *
   * @description
   * This assumes you have pages set up like this:
   *  - /category (about page)
   *  - /category/[id] (view an item in the category)
   *  - /category/filter (new filter page)
   *  - /category/filter/[id] (saved filter page)
   *  - /category/search
   *  - /category/search/[query]
   * @example
   * 'company'
   * 'accountants'
   * 'officers'
   */
  urlPath: string
  // the things you are filtering for, eg: companies, accountants
  labelPlural: string
  // the thing you are filtering for, eg: company, accountant
  labelSingular: string

  /**
   * A list of the filters which can be used on this category of data. Should be mostly generated from groovy script.
   */
  filters: IFilterOption[]

  // the filters primary table from where results are returned
  main_table: string
  // a uniquely identifying column in the database table such as a company number, accountant name, or person number
  uniqueIdentifier: string
  /**
   * The url prefix to view an item which will be followed by a unique identifier.
   * @deprecated Deprecated in favour of using `urlPath`
   * @description
   * Must have a leading and trailing slash.
   * @example
   * `/company/`
   * `/accountant/`
   */
  viewItemUrl: string

  // the operation code in the database that limits the number of downloads of these record types. eg download_company_records
  operation_code: string
}
