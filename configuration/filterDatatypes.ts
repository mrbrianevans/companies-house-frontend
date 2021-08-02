import { IMinorQuery } from '../types/IQueries'

export enum FilterDatatype {
  string,
  number,
  date
}

type FilterDatatypeProperties = {
  english: string
  sqlConverter: (v: any[]) => any[]
}

// not sure if this is actually necessary (and how to type it correctly)
// export const FilterDatatypeMap = new Map<FilterDatatype, FilterDatatypeProperties>([
//   [FilterDatatype.string, { sqlConverter: (v) => v.map((val) => val.trim()), english: 'string' }],
//   [FilterDatatype.number, { sqlConverter: (v) => v.map((val) => Number(val)), english: 'number' }],
//   [FilterDatatype.date, { sqlConverter: (v) => v.map((val) => new Date(val)), english: 'date' }]
// ])
