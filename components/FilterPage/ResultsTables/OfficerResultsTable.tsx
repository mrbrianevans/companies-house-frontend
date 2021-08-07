// results table for officer
// this file is located in: /components/FilterPage/ResultsTables/OfficerResultsTable.tsx
import Link from 'next/link'
import { convertOfficerDatabaseItemToItem, IOfficerDatabaseItem as ResultType } from '../../../types/IOfficer'
import { IResultsTable } from '../../../types/IResultsTable'
import { splitDate } from '../../../helpers/splitDate'
import { formatOfficerName } from '../../../helpers/officers/formatOfficerName'
const styles = require('./ResultsTable.module.sass')
export const OfficerResultsTable: IResultsTable<ResultType> = ({
  matchingResults,
  tableClassName,
  filterConfig,
  cachedFilter
}): JSX.Element => {
  return (
    <table className={tableClassName}>
      <thead>
        <tr>
          <th />
          <th>Name</th>
          <th>Birth date</th>
          <th>Occupation</th>
          <th>Nationality</th>
          <th>Address</th>
          <th>Country of residence</th>
        </tr>
      </thead>
      <tbody>
        {matchingResults?.length > 0 &&
          matchingResults.map((item, index) => {
            const officer = convertOfficerDatabaseItemToItem(item)
            const birthDate = splitDate(officer.birthDate)
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className={styles.nobreak}>
                  <Link href={'/officer/' + officer.personNumber}>
                    <a>{formatOfficerName(officer).slice(0, 100)}</a>
                  </Link>
                </td>
                <td className={styles.nobreak}>
                  {birthDate.month?.slice(0, 3)} {birthDate.year}
                </td>
                <td>{officer.occupation}</td>
                <td>{officer.nationality}</td>
                <td>
                  {officer.postCode && `${officer.postCode}, `}
                  {officer.postTown}
                </td>
                <td>{officer.usualResidentialCountry}</td>
              </tr>
            )
          })}
      </tbody>
    </table>
  )
}
