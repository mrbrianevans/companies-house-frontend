import { createApiClient } from '@companieshouse/api-sdk-node'

export const getCompanyFilings: (company_number: string) => any[] = (company_number) => {
  const api = createApiClient(process.env.APIUSER)
  //todo: call companies house API using Axios
  // promise.all() to format filing descriptions
  return []
}
