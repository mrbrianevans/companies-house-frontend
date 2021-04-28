import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabasePool } from '../../../helpers/connectToDatabase'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { company_number }
  } = req
  try {
    const pool = getDatabasePool()
    console.time('Query database SELECT filing events')
    const { rows: filingEvents } = await pool.query('SELECT * FROM filing_events_legacy WHERE company_number=$1;', [
      company_number
    ])
    console.timeEnd('Query database SELECT filing events')
    console.time('Query database SELECT company events')
    const { rows: companyEvents } = await pool.query('SELECT * FROM company_events WHERE company_number=$1;', [
      company_number
    ])
    console.timeEnd('Query database SELECT company events')
    await pool.end()
    res.status(200).json({ filingEvents, companyEvents })
  } catch (e) {
    console.error('Error occured during API execution')
    console.log(e)
    res.status(501).end('Error occured with Database fetch')
  }
}
