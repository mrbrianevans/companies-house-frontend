import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { getDatabasePool } from '../../../helpers/connectToDatabase'
import { IUserFilter } from '../../../types/IUserFilter'
import { combineQueries } from '../../../interface/filterCompanies/combineQueries'
const QueryStream = require('pg-query-stream')
import * as csv from 'fast-csv'

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
  
  WHERE id=$1
  `,
      [user_filter_id]
    )
    .then(({ rows }) => rows[0])
  //todo: get the download limit remaining on the users account
  const limit = 1000
  const { value: bigValue, query: bigQuery } = combineQueries(user_filter.filters, limit)
  const query = new QueryStream(bigQuery, bigValue)
  const pgStream = client.query(query)
  const csvStream = csv.parse({ headers: true })
  pgStream.pipe(csvStream).pipe(process.stdout)
  //todo: pipe from PSQL to CSV to Storage
  // need a translation layer between postgres (json) and csv
  await client.release()
}
