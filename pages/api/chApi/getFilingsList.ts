import { createApiClient } from '@companieshouse/api-sdk-node'
import { NextApiRequest, NextApiResponse } from 'next'
import { formatFilingDescription } from '../../../interface/event/formatFilingDescription'
import { insertFilingEvent } from '../../../interface/event/insertFilingEvent'
import { Timer } from '../../../helpers/Timer'

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
  const timer = new Timer({ label: 'get filing history', filename: '/pages/api/chApi/getFilingsList.ts' })
  const api = createApiClient(process.env.APIUSER)
  const apiTimer = timer.start('call gov api to fetch filing history')
  //todo: this should be moved to /interface, checked for the rate limit, increase the count of events, manual API call
  // - use promise.all
  const apiResponse = await api.companyFilingHistory.getCompanyFilingHistory(company_number)
  apiTimer.stop()
  const response: GetFilingsListResponse = { items: [], totalCount: apiResponse?.resource?.totalCount }
  if (apiResponse.resource) {
    const formatDescriptionsTimer = timer.start('Format filing descriptions')
    for (let item of apiResponse.resource.items) {
      const description = await formatFilingDescription(item.description, item.descriptionValues)
      response.items.push({ description, date: item.date, id: item.transactionId, category: item.category })
      insertFilingEvent(item, description, company_number) // this can be done in the background
    }
    formatDescriptionsTimer.stop()
  }
  response.items.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
  timer.flush()
  res.status(apiResponse.httpStatusCode).json(response)
}

export interface GetFilingsListResponse {
  items: { description: string; date: string; id: string; category: string }[]
  totalCount: number
}
