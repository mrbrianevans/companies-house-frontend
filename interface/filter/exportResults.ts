import { getDatabasePool } from '../../helpers/connectToDatabase'
import { IUserFilter } from '../../types/IUserFilter'
import combineQueries from './combineQueries'
import { Timer } from '../../helpers/Timer'
import { Storage } from '@google-cloud/storage'
import * as csv from 'fast-csv'
import QueryStream from 'pg-query-stream'
import getFilterConfig from '../../helpers/getFilterConfig'
import { ServerResponse } from 'http'
import { prettyPrintSqlQuery } from '../../helpers/prettyPrintSqlQuery'
import { sqlNameToEnglish } from '../../helpers/sqlNameToEnglish'
import { readableResultDates } from '../../helpers/serialiseResultDates'
import { countResults } from './countResults'

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
  const pool = await getDatabasePool()
  const client = await pool.connect()
  const config = getFilterConfig({ category: user_filter.category })
  const timer = new Timer({
    label: 'Stream records to CSV',
    details: { class: 'download-csv', filterId: user_filter.cached_filter_fk },
    filename: '/pages/api/filter/downloadCsv.ts'
  })
  const remainingExportsTimer = timer.start('Calculate remaining exports for this user')
  //get the download limit remaining on the users account
  //todo: this is not working because the COUNT results function is not being called, so they all have count 0
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
    .then(({ rows }) => rows[0]['remaining_exports'])
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
  //todo: need to do something with this limit such as actually limit the number of results
  try {
    // stream the csv
    // gets a handle to the file on google cloud storage. checks if it exists, or uses handle to upload
    const storage = new Storage()
    const bucket = storage.bucket('csv-export-cache')
    console.assert(user_filter.category && user_filter.cached_filter_fk, 'referencing GCS file with undefined name')
    const fileHandle = bucket.file(user_filter.category + '/' + user_filter.cached_filter_fk)
    const [exists] = await fileHandle.exists()
    if (false && exists) {
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
      // add the limit to the end of the query and get the matching results from main_table
      const limitedQuery = `
  WITH results AS (${bigQuery}) 
  SELECT * FROM results JOIN ${config.main_table} m 
    ON results.${config.uniqueIdentifier} = m.${config.uniqueIdentifier}`
      const query = new QueryStream(limitedQuery, bigValue)
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
