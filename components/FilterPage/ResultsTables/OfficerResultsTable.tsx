// results table for officer
// this file is located in: /components/FilterPage/ResultsTables/OfficerResultsTable.tsx
import Link from 'next/link'
import { IFilterConfig } from '../../../types/IFilterConfig'
import { ICachedFilter } from '../../../types/ICachedFilter'
import { IOfficerItem as ResultType } from '../../../types/IOfficer'

interface OfficerResultsTableParams {
  matchingResults: ResultType[]
  tableClassName: any
  filterConfig: IFilterConfig
  cachedFilter?: ICachedFilter<any>
}

export function OfficerResultsTable({
  matchingResults,
  tableClassName,
  filterConfig,
  cachedFilter
}: OfficerResultsTableParams): JSX.Element {
  // the zeroth row is used to determine the headers.
  // put the unique identifier column in the first position always
  return (
    <table className={tableClassName}>
      <thead>
        <tr>
          <th />
          {Object.keys(matchingResults[0]).map((columnName, index) => (
            <th key={index}>{columnName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {matchingResults?.length > 0 &&
          matchingResults.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              {Object.entries(item).map(([columnName, value], index) => (
                <td key={index}>
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