// this file is located in: /pages/api/user/saveUserFilter.ts

import { SaveUserFilterParams, SaveUserFilterOutput, saveUserFilter } from '../../../interface/user/saveUserFilter'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { getUser } from '../../../interface/user/getUser'

// api endpoint on /api/user/saveUserFilter
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { savedFilterId }
  }: { body: SaveUserFilterParams } = req
  if ([savedFilterId].some((param) => param === undefined)) {
    res.status(400).send('Some missing params')
    return
  }
  const session = await getSession({ req })
  const user = await getUser({ session })
  if (!user) {
    res.status(401).send('Not logged in')
    return
  }
  const output = await saveUserFilter({ savedFilterId, userId: user.id })
  if (output) {
    const { userFilterId }: SaveUserFilterOutput = output
    res.json({ userFilterId })
    return
  } else {
    res.status(500).send('Failed')
    return
  }
}
