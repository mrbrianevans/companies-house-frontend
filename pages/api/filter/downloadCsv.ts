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
  WHERE u.id=$1
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
  const timer = new Timer({ label: 'Stream query to CSV' })
  const storage = new Storage()
  const bucket = storage.bucket('filter-facility-csv-downloads')
  const fileHandle = bucket.file(user_filter.category + '/' + user_filter.saved_filter_fk)
  const storageStream = fileHandle.createWriteStream({ metadata: { contentType: 'application/csv' } })
  const query = new QueryStream(bigQuery, bigValue)
  const pgStream = client.query(query)
  const csvStream = csv.format()
  pgStream.pipe(csvStream).pipe(storageStream)
  pgStream.on('end', async () => {
    await client.release()
    res.status(200).json({
      message: `success in ${timer.flush()}ms`,
      link: await fileHandle.getSignedUrl({
        action: 'read',
        expires: new Date(Date.now() + 86400), // expires in 24 hours
        promptSaveAs: 'filter-facility-download.csv',
        contentType: 'application/csv'
      })
    })
  })
  pgStream.on('error', console.error)
  //todo: pipe from PSQL to CSV to Storage
  // need a translation layer between postgres (json) and csv
}
