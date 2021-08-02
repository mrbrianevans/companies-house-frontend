// results table for officer
// this file is located in: /components/FilterPage/ResultsTables/OfficerResultsTable.tsx
import Link from 'next/link'
import { IOfficerItem as ResultType } from '../../../types/IOfficer'
import { IResultsTable } from '../../../types/IResultsTable'

export const OfficerResultsTable: IResultsTable<ResultType> = ({
  matchingResults,
  tableClassName,
  filterConfig,
  cachedFilter
}): JSX.Element => {
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
                    <Link href={`/${filterConfig.urlPath}/${value}`}>
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
