import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { getDatabasePool } from '../../../helpers/connectToDatabase'
import { IUserFilter } from '../../../types/IUserFilter'
import * as csv from 'fast-csv'
import { Timer } from '../../../helpers/Timer'
import { Storage } from '@google-cloud/storage'
import combineQueries from '../../../interface/filter/combineQueries'
import { FilterCategory } from '../../../types/FilterCategory'
import { getUser } from '../../../interface/user/getUser'
import { exportResults } from '../../../interface/filter/exportResults'
import getFilterConfig from '../../../helpers/getFilterConfig'

const QueryStream = require('pg-query-stream')

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const timer = new Timer({ filename: '/pages/api/filter/downloadCsv.ts' })
  const session = await getSession({ req })
  const user = await getUser({ session })
  if (!user) {
    res.status(401).send('Not logged in')
    return
  }
  const user_filter_id = req.query.id
  if (!user_filter_id) {
    res.status(400).send('Filter id not set')
    return
  }
  const pool = await getDatabasePool()
  // get the filter details saved by the user
  const user_filter: IUserFilter = await pool
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
    .catch((e) => timer.postgresError(e))
  if (!user_filter) {
    res.status(404).send("Filter doesn't exist")
    return
  } else if (user_filter.user_id_fk.toString() !== user.id.toString()) {
    res.status(403).send('Not authorised to download this filter')
    return
  }

  res.setHeader('content-type', 'text/csv')
  const success = await exportResults({ user_filter, res })
  if (!success) {
    res.status(500)
    return
  }
  res.end()

  // this saves the export to count against the users quote
  const config = getFilterConfig({ category: user_filter.category })
  await pool
    .query(
      `INSERT INTO user_exports (id, user_filter_fk, timestamp, time_to_export, operation_code) 
        VALUES (DEFAULT, $1, DEFAULT, $2, $3);`,
      [user_filter.id, timer.getTimeUntilNow(), config.operation_code]
    )
    .catch((e) => timer.postgresError(e))
}
