// this file is located in: /pages/api/filter/cacheFilter.ts

import { cacheFilter, CacheFilterOutput, CacheFilterParams } from '../../../interface/filter/cacheFilter'
import { NextApiRequest, NextApiResponse } from 'next'
import { filtersAreValid } from '../../../helpers/filters/validateFilter'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { filters, category }
  }: { body: CacheFilterParams } = req
  if (!filtersAreValid({ filters, category })) {
    res.status(400).send('Invalid filters')
    return
  }
  const output = await cacheFilter({ filters, category })
  if (output) {
    const { id }: CacheFilterOutput = output
    res.json({ id })
  } else {
    res.status(500).send('Failed to get filter id')
  }
}
