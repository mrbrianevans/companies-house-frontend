// results table for officer
// this file is located in: /components/FilterPage/ResultsTables/OfficerResultsTable.tsx
import Link from 'next/link'
import { convertOfficerDatabaseItemToItem, IOfficerDatabaseItem as ResultType } from '../../../types/IOfficer'
import { IResultsTable } from '../../../types/IResultsTable'
import { splitDate } from '../../../helpers/utils/DateUtils'
import { formatOfficerName } from '../../../helpers/officers/formatOfficerName'
import { capitalizeEveryWord } from '../../../helpers/utils/StringUtils'
import { CloudStorageUrl } from '../../../types/constants/CloudStorageUrl'
import Image from 'next/image'
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
          <th></th>
        </tr>
      </thead>
      <tbody>
        {matchingResults?.length > 0 &&
          matchingResults.map((item, index) => {
            const officer = convertOfficerDatabaseItemToItem(item)
            const birthDate = splitDate(officer.birthDate)
            const country = officer.usualResidentialCountry ?? officer.country
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className={styles.nobreak}>
                  <Link href={'/officer/' + officer.personNumber}>
                    <a>{capitalizeEveryWord(formatOfficerName(officer).slice(0, 100))}</a>
                  </Link>
                </td>
                <td className={styles.nobreak}>
                  {birthDate.month?.slice(0, 3)} {birthDate.year}
                </td>
                <td>{capitalizeEveryWord(officer.occupation)}</td>
                <td>{capitalizeEveryWord(officer.nationality)}</td>
                <td>
                  {officer.postCode && `${officer.postCode}, `}
                  {capitalizeEveryWord(officer.postTown)}
                </td>
                <td>{country && <>{capitalizeEveryWord(country)} </>}</td>
                <td>
                  {country && (
                    <Image
                      src={CloudStorageUrl + 'flags/3by2/' + country.toLowerCase() + '.svg'}
                      width={25}
                      height={15}
                      alt={country?.slice(0, 2)}
                    />
                  )}
                </td>
              </tr>
            )
          })}
      </tbody>
    </table>
  )
}
