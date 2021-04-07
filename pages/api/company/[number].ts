import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabasePool } from '../../../helpers/connectToDatabase'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { number }
  } = req
  try {
    console.time('Query database SELECT')
    const pool = getDatabasePool()
    const { rows: company } = await pool.query('SELECT * FROM companies WHERE number=$1;', [number])
    const {
      rows: sics
    } = await pool.query(
      'SELECT description as sic_code FROM sic, sic_map WHERE company_number=$1 AND code=sic_code;',
      [number]
    )
    await pool.end()
    console.timeEnd('Query database SELECT')
    console.assert(company.length === 1, 'Multiple rows returned for single company number ' + number)
    if (company.length === 0) res.status(404).end('Company not found')
    company[0].sicCodes = sics
    res.status(200).json({ company: company[0] })
  } catch (e) {
    console.error('Error occured during API execution')
    console.log(e)
    res.status(501).end('Error occured with Database fetch')
  }
}
