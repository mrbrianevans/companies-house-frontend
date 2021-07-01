// this file is located in: /pages/api/filter/countResults.ts

import { CountResultsParams, CountResultsOutput, countResults } from '../../../interface/filter/countResults'
import { NextApiRequest, NextApiResponse } from 'next'

// api endpoint on /api/filter/countResults
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { filters, category }
  }: { body: CountResultsParams } = req
  const { count }: CountResultsOutput = await countResults({ filters, category })
  res.json({ count })
}
