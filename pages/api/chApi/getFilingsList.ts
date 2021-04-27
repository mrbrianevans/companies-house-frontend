import { createApiClient } from '@companieshouse/api-sdk-node'
import { NextApiRequest, NextApiResponse } from 'next'
import { formatFilingDescription } from '../../../interface/formatFilingDescription'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { company_number } = req.query
  if (typeof company_number !== 'string') {
    res.status(400).send('Requires 1 company number')
    return
  }
  if (!company_number.match(/^[0-9]{6,8}|([A-Z]{2}[0-9]{6})$/)) {
    res.status(400).send('Invalid company number')
    return
  }
  const api = createApiClient(process.env.APIUSER)
  const apiResponse = await api.companyFilingHistory.getCompanyFilingHistory(company_number)
  const response: GetFilingsListResponse = { items: [], totalCount: apiResponse?.resource?.totalCount }

  if (apiResponse.resource) {
    for (let item of apiResponse.resource.items) {
      const description = await formatFilingDescription(item.description, item.descriptionValues)
      response.items.push({ description, date: item.date, id: item.transactionId })
    }
  }
  response.items.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
  res.status(apiResponse.httpStatusCode).json(response)
}

export interface GetFilingsListResponse {
  items: { description: string; date: string; id: string }[]
  totalCount: number
}
