// this file is located in: /api/user/getUserFilterId.ts

import { getUserFilterId, GetUserFilterIdOutput, GetUserFilterIdParams } from '../../../interface/user/getUserFilterId'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { getUser } from '../../../interface/user/getUser'
// api endpoint on /api/user/getUserFilterId
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { cachedFilterId }
  }: { body: GetUserFilterIdParams } = req
  if ([cachedFilterId].some((param) => param === undefined)) {
    res.status(400).send('Some params are undefined. Required: cachedFilterId: ' + cachedFilterId)
    return
  }
  const session = await getSession({ req })
  const user = await getUser({ session })
  let output: GetUserFilterIdOutput
  if (!user) output = { userFilterId: null }
  else output = await getUserFilterId({ cachedFilterId, userId: user.id })
  if (output) {
    const { userFilterId }: GetUserFilterIdOutput = output
    res.json({ userFilterId })
    return
  } else {
    res.status(500).send('Failed')
    return
  }
}
