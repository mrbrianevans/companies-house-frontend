import * as React from 'react'
import Link from 'next/link'
import { IFilterConfig } from '../../../types/IFilterConfig'
import { ICachedFilter } from '../../../types/ICachedFilter'

interface GenericResultsTableParams<ResultType> {
  matchingResults: ResultType[]
  tableClassName: any
  filterConfig?: IFilterConfig
  cachedFilter?: ICachedFilter<any>
}

export function GenericResultsTable<ResultType>({
  matchingResults,
  tableClassName,
  filterConfig,
  cachedFilter
}: GenericResultsTableParams<ResultType>): JSX.Element {
  // the zeroth row is used to determine the headers.
  //todo: show the columns which were filtered by first.
  // put the unique identifier column in the first position always
  return (
    <table className={tableClassName}>
      <thead>
        <tr>
          <th />
          {Object.keys(matchingResults[0]).map((columnName) => (
            <th>{columnName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {matchingResults?.length > 0 &&
          matchingResults.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              {Object.entries(item).map(([columnName, value]) => (
                <td>
                  {columnName === filterConfig.uniqueIdentifier ? (
                    <Link href={filterConfig.viewItemUrl + value}>
                      <a target={'_blank'}>{value}</a>
                    </Link>
                  ) : (
                    value
                  )}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  )
}
