// this file is located in: /pages/api/filter/getItemById.ts

import { GetItemByIdParams, GetItemByIdOutput, getItemById } from '../../../interface/filter/getItemById'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { getUser } from '../../../interface/user/getUser'

// api endpoint on /api/filter/getItemById
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { id, category }
  }: { body: GetItemByIdParams } = req
  if ([id, category].some((param) => param === undefined)) {
    res.status(400).send('Some params are undefined. Required: id, category')
    return
  }
  const session = await getSession({ req })
  const user = await getUser({ session })
  const output = await getItemById({ id, category })
  if (output) {
    const { item }: GetItemByIdOutput = output
    res.json({ item })
    return
  } else {
    res.status(500).send('Failed')
    return
  }
}
