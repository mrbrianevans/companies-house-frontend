import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabasePool } from '../../../helpers/connectToDatabase'
import getCompanyEvents from '../../../interface/getCompanyEvents'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { company_number }
  } = req
  try {
    const { filingEvents, companyEvents } = await getCompanyEvents(company_number.toString())
    res.status(200).json({ filingEvents, companyEvents })
  } catch (e) {
    console.error('Error occured during API execution')
    console.log(e)
    res.status(501).end('Error occured with Database fetch')
  }
}
