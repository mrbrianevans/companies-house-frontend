import { getDatabasePool } from '../../helpers/sql/connectToDatabase'
import { IUserFilter } from '../../types/IUserFilter'
import combineQueries from './combineQueries'
import { Timer } from '../../helpers/Timer'
import { Storage } from '@google-cloud/storage'
import * as csv from 'fast-csv'
import QueryStream from 'pg-query-stream'
import getFilterConfig from '../../helpers/getFilterConfig'
import { ServerResponse } from 'http'
import { readableResultDates } from '../../helpers/serialiseResultDates'
import { countResults } from './countResults'
import { prettyPrintSqlQuery } from '../../helpers/sql/prettyPrintSqlQuery'

interface ExportResultsParams {
  user_filter: IUserFilter
  res: ServerResponse
}
/** takes a cached filter ID,
 * queries the database or fetches a cached version from Cloud Storage,
 * writes to the passed writable stream,
 * and returns boolean for success/failures*/
export const exportResults: (params: ExportResultsParams) => Promise<boolean> = async ({ user_filter, res }) => {
  const userId = user_filter.user_id_fk
  const pool = await getDatabasePool({ timeout_milliseconds: 600_000 }) // longer timeout on export queries
  const client = await pool.connect()
  const config = getFilterConfig({ category: user_filter.category })
  const timer = new Timer({
    label: 'Stream records to CSV',
    details: { filterId: user_filter.cached_filter_fk, category: user_filter.category },
    filename: '/pages/api/filter/downloadCsv.ts'
  })
  const remainingExportsTimer = timer.start('Calculate remaining exports for this user')
  //get the download limit remaining on the users account
  const remainingExports: number = await client
    .query(
      `
  SELECT
      -- the quota of the user
      COALESCE((SELECT monthly_limit
                FROM user_role_quotas urq
                         JOIN users u ON u.role_code=urq.role_code
                WHERE u.id=$1 AND urq.operation=$2 LIMIT 1), 0) -
          -- the usage for this period of the user
      COALESCE((SELECT export_usage FROM user_export_usage
                WHERE user_id=$1
                  AND operation_code=$2
                  AND period=TO_CHAR(CURRENT_TIMESTAMP, 'Mon YYYY')
               ) ,0)
          AS remaining_exports ;
  `,
      [userId, config.operation_code]
    )
    .then(({ rows }) => Number(rows[0]['remaining_exports']))
    .catch((e) => timer.postgresError(e))
  remainingExportsTimer.stop()
  const { count } = await countResults({ filters: user_filter.filters, category: user_filter.category })
  console.log(
    'The user has',
    remainingExports,
    'remaining exports this month, and is attempting to download a result set of',
    count,
    'records'
  )
  timer.addDetail('user remaining export quota', remainingExports)
  timer.addDetail('result size', count)
  //todo: add an option for a user to download a custom amount of results instead of the full set.
  // Especially useful if they can sort results.
  if (remainingExports < count) {
    // the user doesn't have enough remaining export quota
    timer.customError('User attempted to download a CSV with more rows than their remaining download quota')
    return false
  }
  try {
    // stream the csv
    // gets a handle to the file on google cloud storage. checks if it exists, or uses handle to upload
    const storage = new Storage()
    const bucket = storage.bucket('csv-export-cache')
    console.assert(user_filter.category && user_filter.cached_filter_fk, 'referencing GCS file with undefined name')
    const fileHandle = bucket.file(user_filter.category + '/' + user_filter.cached_filter_fk)
    const [exists] = await fileHandle.exists()
    if (exists) {
      const pipeFromStorageTimer = timer.start('Piping CSV from Storage to API response')
      await new Promise((resolve, reject) =>
        fileHandle
          .createReadStream()
          .on('end', resolve)
          .on('error', reject)
          .on('data', (d: Buffer) => res.write(d))
      )
      pipeFromStorageTimer.stop()
    } else {
      // get the query to run - this will be okay when combineQueries has been fixed/improved to return all column names
      const { value: bigValue, query: bigQuery } = combineQueries({
        filters: user_filter.filters,
        category: user_filter.category
      })
      const query = new QueryStream(bigQuery, bigValue)
      const storageStream = fileHandle.createWriteStream({ metadata: { contentType: 'text/csv' } })
      const pgStream = client.query(query)
      const csvStream = csv.format({
        headers: true,
        transform: readableResultDates
      })
      const queryDatabaseTimer = timer.start('Querying database, piping results to Storage and API response')
      await new Promise((resolve, reject) => {
        pgStream // query results
          // to debug database output, uncomment this line:
          // .on('data', (d: Buffer) => console.log(d))
          .pipe(csvStream) // convert JSON to CSV
          .on('data', (d: Buffer) => res.write(d)) // send to client
          .on('error', reject)
          // split the pipe: one output to Storage, and one to res
          .pipe(storageStream) // save to file in Cloud Storage
          .on('error', reject)
          .on('finish', resolve)
      })
      queryDatabaseTimer.stop()
    }
    return true // this indicates that the file was successfully piped to the writeable stream
  } catch (e) {
    timer.genericError(e)
    return false
  } finally {
    client.release()
    await pool.end()
    timer.flush()
  }
}
