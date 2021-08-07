// this file is located in: /pages/api/officer/getOfficerAppointmentsForOfficer.ts

import {
  getOfficerAppointmentsForOfficer,
  GetOfficerAppointmentsForOfficerOutput,
  GetOfficerAppointmentsForOfficerParams
} from '../../../interface/officer/getOfficerAppointmentsForOfficer'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { getUser } from '../../../interface/user/getUser'

// api endpoint on /api/officer/getOfficerAppointmentsForOfficer
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { personNumber }
  }: { body: GetOfficerAppointmentsForOfficerParams } = req
  if ([personNumber].some((param) => param === undefined)) {
    res.status(400).send('Some params are undefined. Required: personNumber')
    return
  }
  const session = await getSession({ req })
  const user = await getUser({ session })
  const output = await getOfficerAppointmentsForOfficer({ personNumber })
  if (output) {
    const { officerAppointments }: GetOfficerAppointmentsForOfficerOutput = output
    res.json({ officerAppointments })
    return
  } else {
    res.status(500).send('Failed')
    return
  }
}
