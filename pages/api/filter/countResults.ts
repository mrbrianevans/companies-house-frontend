// this file is located in: /pages/api/filter/countResults.ts

import { countResults, CountResultsOutput, CountResultsParams } from '../../../interface/filter/countResults'
import { NextApiRequest, NextApiResponse } from 'next'
import { filtersAreValid } from '../../../helpers/filters/validateFilter'

// api endpoint on /api/filter/countResults
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { filters, category }
  }: { body: CountResultsParams } = req
  if (!filtersAreValid({ filters, category })) {
    res.status(400).send('Invalid filters')
    return
  }
  const { count }: CountResultsOutput = await countResults({ filters, category })
  res.json({ count })
}
