//todo: List of filters
// - What software the accountant uses [array | string]
// - How many clients the accountant has [number]
// - What size clients the accountant has [financials]
// - What size the accountant is (based on his financials) [financials]
// - What is the location of the accountant [region]
// - What is the location of the clients [region array]
// - Who a specific client is
// - Name of accountant [string]
// - type of accounts filed (micro, small company etc) [string]

//todo: When viewing an accountant in more detail:
// - A distribution of when they file accounts
// - a map of their clients (according to size, using bubbles)
// - A distribution of their clients size (based on financials, and accounts type)
// - maybe an estimation of their fees based on their clients

import { IMinorQuery } from './IQueries'
import { FilterCategory } from './FilterCategory'
import { FilterComparison } from '../configuration/filterComparisons'

export interface IFilterValue {
  /**
   * The name of the field being filtered by, such as name. A human readable version of the column name in most cases.
   */
  field: string
  comparison: FilterComparison
  /**
   * An array of values to filter by. If string, then logical OR between values. If numeric then [min,max] or [value]
   */
  values: string[] | [number, number] | [number]
  /**
   * Whether to include or exclude results matching this filter
   */
  exclude: boolean
}

export interface IFilterOption {
  field: string
  possibleComparisons: FilterComparison[]
  dataType: 'string' | 'number' | 'date'
  /**
   * A function which takes an instance of the filter and returns a human readable version.
   *
   * Optional as a default will be used if none is supplied.
   * @param filterValue a filter such as one created by a user to filter some data.
   */
  formatter?: (filterValue: IFilterValue) => string
  columnName: string
  /**
   * If this column can be filtered by the id of anther table, such as filter companies by officer id
   */
  references?: { tableName: string; column: string }
  /**
   * Optional suggestions to show in a dropdown box
   */
  suggestions?: string[]
}

// export type IFilterOption = INumberFilterOption | IStringFilterOption
//todo: the filter system needs to be improved as follows:
// [x] add the option for excluding
// - add 'date' as a value type
// - add 'is greater than' and 'is less than' for number comparisons
// - add suggestions as value:label pairs (optionally)
