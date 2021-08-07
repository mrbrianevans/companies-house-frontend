// this file is located in: /pages/api/officer/searchOfficersByName.ts

import {
  searchOfficersByName,
  SearchOfficersByNameOutput,
  SearchOfficersByNameParams
} from '../../../interface/officer/searchOfficersByName'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { getUser } from '../../../interface/user/getUser'

// api endpoint on /api/officer/searchOfficersByName
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { query }
  }: { body: SearchOfficersByNameParams } = req
  if ([query].some((param) => param === undefined)) {
    res.status(400).send('Some params are undefined. Required: query')
    return
  }
  const session = await getSession({ req })
  const user = await getUser({ session })
  const output = await searchOfficersByName({ query })
  if (output) {
    const { results }: SearchOfficersByNameOutput = output
    res.json({ results: results })
    return
  } else {
    res.status(500).send('Failed')
    return
  }
}
