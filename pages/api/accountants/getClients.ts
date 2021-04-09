import { NextApiRequest, NextApiResponse } from 'next'
import getAccountantClients from '../../../interface/getAccountantClients'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const name = req.query.name
  if (typeof name !== 'string') {
    res.status(400).send('Requires 1 name')
    return
  }
  const clients = await getAccountantClients(name)
  res.status(200).json(clients)
}
