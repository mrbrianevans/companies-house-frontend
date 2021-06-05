// this file is located in: /pages/api/filter/getFilterId.ts

import { GetFilterIdParams, GetFilterIdOutput, getFilterId } from '../../../interface/filter/getFilterId'
import { NextApiRequest, NextApiResponse } from 'next'

// api endpoint on /api/filter/getFilterId
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body: { filters, category } }: { body: GetFilterIdParams } = req
  const output = await getFilterId({ filters, category })
  if(output) {
    const { id, lastRun }: GetFilterIdOutput = output
    res.json({ id, lastRun })
    return
  }else{
    res.status(500).send("Failed to get Id for filters")
    return
  }

}
