// this file is located in: /pages/api/officer/getOfficerAppointmentsForCompany.ts

import {
  GetOfficerAppointmentsForCompanyParams,
  GetOfficerAppointmentsForCompanyOutput,
  getOfficerAppointmentsForCompany
} from '../../../interface/officer/getOfficerAppointmentsForCompany'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { getUser } from '../../../interface/user/getUser'

// api endpoint on /api/officer/getOfficerAppointmentsForCompany
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { companyNumber }
  }: { body: GetOfficerAppointmentsForCompanyParams } = req
  if ([companyNumber].some((param) => param === undefined)) {
    res.status(400).send('Some params are undefined. Required: companyNumber')
    return
  }
  const session = await getSession({ req })
  const user = await getUser({ session })
  const output = await getOfficerAppointmentsForCompany({ companyNumber })
  if (output) {
    const { officers }: GetOfficerAppointmentsForCompanyOutput = output
    res.json({ officers })
    return
  } else {
    res.status(500).send('Failed')
    return
  }
}
