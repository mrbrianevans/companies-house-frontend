import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { getDatabasePool } from '../../../helpers/connectToDatabase'
import { IUserFilter } from '../../../types/IUserFilter'
import * as csv from 'fast-csv'
import { Timer } from '../../../helpers/Timer'
import { Storage } from '@google-cloud/storage'
import combineQueries from '../../../interface/filter/combineQueries'
import { FilterCategory } from '../../../types/FilterCategory'

const QueryStream = require('pg-query-stream')

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) {
    res.status(401).send('Not logged in')
    return
  }
  // @ts-ignore this needs to be fixed! define a helper function to get more info about a user on the backend
  const userId = session.user.id
  const user_filter_id = req.query.id
  if (!user_filter_id) {
    res.status(400).send('Filter id not set')
    return
  }
  const pool = await getDatabasePool()
  const client = await pool.connect()
  // get the filter details saved by the user
  const user_filter: IUserFilter = await client
    .query(
      `
          SELECT u.*, cf.filters, cf.category
          FROM user_filters u
                   JOIN cached_filters cf on u.cached_filter_fk = cf.id
          WHERE u.id = $1
      `,
      [user_filter_id]
    )
    .then(({ rows }) => rows[0])
  if (user_filter.user_id_fk.toString() !== userId.toString()) {
    res.status(403).send('Not authorised to download this filter')
    return
  } else if (!user_filter) {
    res.status(404).send("Filter doesn't exist")
    return
  }
  //todo: get the download limit remaining on the users account
  const remainingExports: number = await client
    .query(
      `
  SELECT 
         -- the users original quota for the month, minus:
         (SELECT export_usage FROM user_export_usage 
          WHERE user_id=$1 
            AND category=$2
            AND period=TO_CHAR(CURRENT_TIMESTAMP, 'Mon YYYY')
         ) 
             AS remaining_exports ;
  `,
      [userId, user_filter.category]
    )
    .then(({ rows }) => rows[0]['remaining_exports'])
  console.log('The user has', remainingExports, 'remaining exports this month')
  // this saves the export to count against the users quote. Should be moved to end of file with the time taken to produce the download
  await client.query(
    `
  INSERT INTO user_exports (id, user_filter_fk, timestamp) VALUES (DEFAULT, $1, DEFAULT);
  `,
    [user_filter_id]
  )
  const limit = 10_000_000 // temporary to allow testing large files
  // todo: un hard-code COMPANY in here. should be generic
  const { value: bigValue, query: bigQuery } = combineQueries({
    filters: user_filter.filters,
    category: FilterCategory.COMPANY
  })
  const timer = new Timer({
    label: 'Stream query to CSV',
    details: { class: 'download-csv', filterId: user_filter.cached_filter_fk ?? 'null' },
    filename: '/pages/api/filter/downloadCsv.ts'
  })
  const storage = new Storage()
  const bucket = storage.bucket('csv-export-cache')
  console.assert(user_filter.category && user_filter.cached_filter_fk, 'referencing GCS file with undefined name')
  const fileHandle = bucket.file(user_filter.category + '/' + user_filter.cached_filter_fk)
  res.setHeader('content-type', 'text/csv')
  //todo: refactor into a single try catch finally statement for the whole file. at the end, insert a row into user_exports
  const [exists] = await fileHandle.exists()
  if (exists) {
    timer.start('Piping CSV from Storage to API response')
    try {
      await new Promise((resolve, reject) =>
        fileHandle
          .createReadStream()
          .on('end', resolve)
          .on('error', reject)
          .on('data', (d: Buffer) => res.write(d))
      )
      res.end()
    } catch (e) {
      res.status(500).send(e.message)
    } finally {
      client.release()
      timer.flush()
    }
  } else {
    const storageStream = fileHandle.createWriteStream({ metadata: { contentType: 'text/csv' } })
    const query = new QueryStream(bigQuery, bigValue)
    const pgStream = client.query(query)
    const csvStream = csv.format()
    try {
      timer.start('Querying database, piping results to Storage and API response')
      await new Promise((resolve, reject) => {
        pgStream // query results
          .pipe(csvStream) // convert JSON to CSV
          .on('data', (d: Buffer) => res.write(d)) // send to client
          // split the pipe: one output to Storage, and one to res
          .pipe(storageStream) // save to file in Cloud Storage
          .on('error', reject)
          .on('finish', resolve)
      })
      res.end()
    } catch (e) {
      console.error(JSON.stringify({ severity: 'ERROR', message: 'Failed to pipe results to Google Cloud Storage' }))
      res.status(500).send('Download failed')
      return
    } finally {
      client.release()
      timer.flush()
    }
  }
}
