import { NextApiRequest, NextApiResponse } from 'next'
import { formatFilingDescription } from '../../../interface/event/formatFilingDescription'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { description, description_values } = req.body
  if (typeof description !== 'string') {
    res.status(400).send('Requires 1 description')
    return
  }
  const formattedDescription = await formatFilingDescription(description, description_values)
  res.status(200).json({ formattedDescription })
}
