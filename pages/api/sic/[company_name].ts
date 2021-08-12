import { NextApiRequest, NextApiResponse } from 'next'
import { getDatabasePool } from '../../../helpers/sql/connectToDatabase'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { company_name }
  } = req
  const companyName = decodeURIComponent(company_name.toString().toUpperCase())
  console.log(companyName)
  const pool = getDatabasePool()

  const results = pool.query(
    'SELECT description FROM companies, sic, sic_map WHERE name=$1 AND number=company_number AND code=sic_code',
    [companyName]
  )

  res.status(200).json(results)
}
