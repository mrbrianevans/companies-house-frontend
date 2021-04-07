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

export interface IGeneralFilter {
  category: string
  comparison: string
  exclude: boolean
  type: 'string' | 'number'
}

export interface INumberFilter extends IGeneralFilter {
  comparison: 'is between'
  min: number
  max: number
  type: 'number'
}

export interface IStringFilter extends IGeneralFilter {
  comparison: 'begins with' | 'is exactly' | 'includes' | 'ends with'
  values: string[]
  type: 'string'
}

export type IFilter = INumberFilter | IStringFilter

// searching an array of values, whether it includes or excludes the value
export interface IArrayFilter extends IGeneralFilter {
  category: 'software' | 'location'
  comparison: 'include' | 'exclude'
  value: string[] | number
}

export interface INumberFilterOption {
  possibleComparisons: INumberFilter['comparison'][]
  category: string
  valueType: 'number'
}

export interface IStringFilterOption {
  possibleComparisons: IStringFilter['comparison'][]
  category: string
  valueType: 'string'
  suggestions?: string[]
}

export type IFilterOption = INumberFilterOption | IStringFilterOption
