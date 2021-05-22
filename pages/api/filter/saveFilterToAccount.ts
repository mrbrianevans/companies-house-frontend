import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { getDatabasePool } from '../../../helpers/connectToDatabase'
import { Timer } from '../../../helpers/Timer'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    res.status(405).send('Only PUT method is allowed. You sent ' + req.method)
    return
  }
  const session = await getSession({ req })
  if (!session) {
    res.status(401).send('Not logged in')
    return
  }
  const userId = session.user.id
  const saved_filter_id = req.body.id
  const filter_category = req.body.category
  if (!saved_filter_id || !filter_category) {
    res.status(400).send('Filter id/category not set')
    return
  }
  const timer = new Timer({ label: 'Save filter to user account', details: { savedFilterId: saved_filter_id } })
  const pool = await getDatabasePool()
  const user_filter_id = await pool.query(
    `
  INSERT INTO user_filters (id, saved_filter_fk, title, created, user_id_fk, category) 
  VALUES (DEFAULT, $1, null, DEFAULT, $2, $3) 
  ON CONFLICT ON CONSTRAINT user_filters_unique_per_user DO NOTHING
  RETURNING id
  `,
    [saved_filter_id, userId, filter_category]
  )
  timer.flush()
  res.status(200).json({ id: user_filter_id })
}
