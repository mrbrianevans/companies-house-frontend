// this file is located in: /pages/api/filter/getItemById.ts

import { getItemById, GetItemByIdOutput, GetItemByIdParams } from '../../../interface/filter/getItemById'
import { NextApiRequest, NextApiResponse } from 'next'

// api endpoint on /api/filter/getItemById
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { id, category }
  }: { body: GetItemByIdParams } = req
  if ([id, category].some((param) => param === undefined)) {
    res.status(400).send('Some params are undefined. Required: id, category')
    return
  }
  const output = await getItemById<any>({ id, category })
  if (output) {
    const { item }: GetItemByIdOutput<any> = output
    res.json({ item })
    return
  } else {
    res.status(500).send('Failed')
    return
  }
}
