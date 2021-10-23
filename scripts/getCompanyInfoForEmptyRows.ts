import { getDatabasePool } from '../helpers/sql/connectToDatabase'
import { setCompanyDetailsFromApi } from '../interface/company/getCompanyProfile'
import Timer from 'timer-logs/index'
import { RateLimitHeaders } from '../types/ApiRateLimitHeaders'

require('dotenv').config({ path: '../.env' })
const getCompanyInfoFor600EmptyRows = async () => {
  const db = getDatabasePool()
  const timer = new Timer({ filename: '/scripts/getCompanyInfoForEmptyRows.ts' })
  timer.start('Get list of empty rows')
  const companyNumbers = await db
    .query(`SELECT number FROM companies WHERE status IS NULL LIMIT 600`)
    .then(({ rows }) => rows.map((row) => row.number))
  timer.stop('Get list of empty rows')

  let rateLimit: RateLimitHeaders
  let counter = 0
  for (const companyNumber of companyNumbers) {
    counter++
    rateLimit = await setCompanyDetailsFromApi(companyNumber)
    if (rateLimit.remain <= 1) break
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
    console.log(res)
    if (res.rateLimit?.remain <= 1) {
      console.log('Waiting', res.rateLimit.reset * 1000 - Date.now(), 'milliseconds to avoid rate limit')
      await new Promise((resolve) => setTimeout(resolve, res.rateLimit.reset * 1000 - Date.now()))
      console.log('Finished sleeping, starting up again')
    }
  }
}

updateAllEmptyRows()
