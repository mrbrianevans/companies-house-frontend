import { getDatabasePool } from '../helpers/sql/connectToDatabase'
import { setCompanyDetailsFromApi } from '../interface/company/getCompanyProfile'
import Timer from 'timer-logs/index'
import { RateLimitHeaders } from '../types/ApiRateLimitHeaders'

require('dotenv').config({ path: '../.env' })
const getCompanyInfoFor600EmptyRows = async () => {
  const db = getDatabasePool()
  const timer = new Timer({ filename: '/scripts/getCompanyInfoForEmptyRows.ts' })
  timer.start('Get list of empty rows')
  const emptyRowQuery = `SELECT number FROM companies WHERE status IS NULL LIMIT 590`
  const insolvencyQuery = `SELECT company_number AS number, updated FROM insolvency_prediction_input WHERE updated = '2021-01-14' LIMIT 590;`
  const companyNumbers = await db.query(insolvencyQuery).then(({ rows }) => rows.map((row) => row.number))
  timer.stop('Get list of empty rows')

  let rateLimit: RateLimitHeaders
  let counter = 0
  for (const companyNumber of companyNumbers) {
    counter++
    rateLimit = (await setCompanyDetailsFromApi(companyNumber)) ?? rateLimit
    timer.tlog`${rateLimit?.remain} API calls remaining, ${counter} companies done, resets in ${(
      (rateLimit?.reset ?? 0) -
      Date.now() / 1000
    ).toFixed(1)}s`
    if ((rateLimit?.remain ?? 0) <= 10) break
  }

  await db.end()
  timer.flush()
  return { rateLimit, finished: companyNumbers.length === 0, counter }
}

const updateAllEmptyRows = async () => {
  let finished = false
  while (!finished) {
    let res = await getCompanyInfoFor600EmptyRows()
    finished = res.finished
    log: console.log(res)
    if (res.rateLimit && res.rateLimit.remain <= 10) {
      console.log('Waiting', (res.rateLimit.reset - Date.now() / 1000).toFixed(1), 'milliseconds to avoid rate limit')
      await new Promise((resolve) => setTimeout(resolve, res.rateLimit.reset * 1000 - Date.now()))
      console.log('Finished sleeping, starting up again')
    } else if (!res.rateLimit) {
      console.log('Rate limit not returned, sleeping 2 minutes until retrying')
      await new Promise((resolve) => setTimeout(resolve, 2 * 60 * 1000))
    }
  }
}

updateAllEmptyRows()
