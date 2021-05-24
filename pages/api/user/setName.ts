import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { getDatabasePool } from '../../../helpers/connectToDatabase'
import { logPostgresError } from '../../../helpers/loggers/PostgresErrorLogger'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) {
    res.status(401).send('Not logged in')
    return
  }
  const userId = session.user.id
  const { name, timestamp } = req.body
  console.log('req.body.name', name)
  console.log('req.body.timestamp', timestamp)
  if (typeof name !== 'string' || !timestamp || typeof timestamp !== 'number') {
    res.status(400).send('Bad request')
    return
  }
  if (name.length > 254) {
    res.status(400).send('Name too long')
    return
  }

  const pool = await getDatabasePool()
  await pool
    .query(
      `
  UPDATE users 
  -- only update the name if it is the most recent update request
  SET name=CASE WHEN name_updated< $1 THEN $2 ELSE "name" END
    WHERE id = $3
  `,
      [new Date(timestamp), name, userId]
    )
    .then((re) => {
      // response is not used, only the status code
      res.status(200).send('Successfully updated name')
    })
    .catch((e) => {
      logPostgresError(e)
      res.status(500).send('Failed to update name')
    })
}
