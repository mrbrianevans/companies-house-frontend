// this file is located in: /pages/api/filter/getFilterId.ts

import { getFilterId, GetFilterIdOutput, GetFilterIdParams } from '../../../interface/filter/getFilterId'
import { NextApiRequest, NextApiResponse } from 'next'
import { filtersAreValid } from '../../../helpers/filters/validateFilter'

// api endpoint on /api/filter/getFilterId
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { filters, category }
  }: { body: GetFilterIdParams } = req
  if (!filtersAreValid({ filters, category })) {
    res.status(400).send('Invalid filters')
    return
  }
  const output = await getFilterId({ filters, category })
  if (output) {
    const { id, lastRun }: GetFilterIdOutput = output
    res.json({ id, lastRun })
    return
  } else {
    res.status(500).send('Failed to get Id for filters')
    return
  }
}
