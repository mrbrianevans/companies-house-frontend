// this file is located in: /pages/api/filter/cacheResults.ts

import { cacheResults, CacheResultsOutput, CacheResultsParams } from '../../../interface/filter/cacheResults'
import { NextApiRequest, NextApiResponse } from 'next'
import { filtersAreValid } from '../../../helpers/filters/validateFilter'

// api endpoint on /api/filter/cacheResults
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { filters, category, id, qty }
  }: { body: CacheResultsParams } = req
  if ([filters, category, id].some((param) => param === undefined)) {
    res.status(400).send('Some params are undefined. Required: filters, category, id')
    return
  }
  if (!filtersAreValid({ filters, category })) {
    res.status(400).send('Invalid filters')
    return
  }
  const output = await cacheResults({
    filters,
    category,
    id,
    qty: 20 // only cache a max of 20 from calls from the API
  })
  if (output) {
    const { results, executionTime }: CacheResultsOutput<Object> = output
    res.json({ results, executionTime })
    return
  } else {
    res.status(500).send('Failed')
    return
  }
}
