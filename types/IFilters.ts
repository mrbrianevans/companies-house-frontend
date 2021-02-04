//todo: List of filters
// - What software the accountant uses [array | string]
// - How many clients the accountant has [number]
// - What size clients the accountant has [financials]
// - What size the accountant is (based on his financials) [financials]
// - What is the location of the accountant [region]
// - What is the location of the clients [region array]
// - Who a specific client is
// - Name of accountant [string]
// - type of accounts filed (micro, small company etc)

//todo: When viewing an accountant in more detail:
// - A distribution of when they file accounts
// - a map of their clients (according to size, using bubbles)
// - A distribution of their clients size (based on financials, and accounts type)
// - maybe an estimation of their fees based on their clients

export interface IFilter {
  category: string
  comparison: string
  value: any
}

// searching an array of values, whether it includes or excludes the value
export interface IArrayFilter extends IFilter {
  category: "software" | "location"
  comparison: "include" | "exclude"
  value: string | number
}

export interface IStringFilter extends IFilter {
  category: "software" | "name-of-accountant" | ""
  comparison: "include" | "exclude"
  value: string | number
}
