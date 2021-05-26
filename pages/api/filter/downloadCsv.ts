import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { getDatabasePool } from '../../../helpers/connectToDatabase'
import { IUserFilter } from '../../../types/IUserFilter'
import { combineQueries } from '../../../interface/filterCompanies/combineQueries'

const QueryStream = require('pg-query-stream')
import * as csv from 'fast-csv'
import { Timer } from '../../../helpers/Timer'
import { Storage } from '@google-cloud/storage'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) {
    res.status(401).send('Not logged in')
    return
  }
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
          SELECT u.*, sf.filters
          FROM user_filters u
                   JOIN saved_filters sf on u.saved_filter_fk = sf.id and u.category = sf.category
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
  const limit = 1000
  const { value: bigValue, query: bigQuery } = combineQueries(user_filter.filters, limit)
  const timer = new Timer({
    label: 'Stream query to CSV',
    details: { class: 'download-csv', filterId: user_filter.saved_filter_fk }
  })
  const storage = new Storage()
  const bucket = storage.bucket('csv-export-cache')
  const fileHandle = bucket.file(user_filter.category + '/' + user_filter.saved_filter_fk)
  res.setHeader('content-type', 'text/csv')
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
