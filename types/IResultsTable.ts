import React from 'react'
import { IFilterConfig } from './IFilterConfig'
import { ICachedFilter } from './ICachedFilter'

export type IResultsTable<ResultType> = React.FC<{
  matchingResults: ResultType[]
  tableClassName: any
  filterConfig: IFilterConfig
  cachedFilter?: ICachedFilter<ResultType>
}>
