// results table for $NAME
// this file is located in: /${DIR_PATH}/${FILE_NAME}
#set($lower_first_letter = $NAME.substring(0,1).toLowerCase())
#set($upper_first_letter = $NAME.substring(0,1).toUpperCase())
#set($the_rest = $NAME.substring(1))
#set($camelName = ${lower_first_letter} + ${the_rest})
#set($PascalName = ${upper_first_letter} + ${the_rest})
#set($nameEnum = $NAME.toUpperCase())
import Link from 'next/link'
import { IFilterConfig } from '../../../types/IFilterConfig'
import { ICachedFilter } from '../../../types/ICachedFilter'
import { I${PascalName}DatabaseItem as ResultType } from '../../../types/I${PascalName}'
const styles = require('./ResultsTable.module.sass')
interface ${PascalName}ResultsTableParams{
  matchingResults: ResultType[]
  tableClassName: any
  filterConfig: IFilterConfig
  cachedFilter?: ICachedFilter<any>
}

export function ${PascalName}ResultsTable({
  matchingResults,
  tableClassName,
  filterConfig,
  cachedFilter
}: ${PascalName}ResultsTableParams): JSX.Element {
  // the zeroth row is used to determine the headers
  return (
    <table className={tableClassName}>
      <thead>
        <tr>
          <th />
          {Object.keys(matchingResults[0]).map((columnName, index) => (
            <th key={index} className={styles.nobreak}>{columnName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {matchingResults?.length > 0 &&
          matchingResults.map((item, index) => {
          const $camelName = convert${PascalName}DatabaseItemToItem(item)
          return <tr key={index}>
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
          )}
      </tbody>
    </table>
  )
}
