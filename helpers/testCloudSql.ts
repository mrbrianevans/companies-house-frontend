import { getDatabasePool } from './connectToDatabase'

const csql = getDatabasePool()
const testPgCloudSql = async () => {
  const { rows } = await csql.query('SELECT COUNT(*) FROM companies;')
  console.log(rows)
}
testPgCloudSql().then(async () => {
  await csql.end()
})
