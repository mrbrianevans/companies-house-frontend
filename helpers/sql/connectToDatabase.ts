import { Pool } from 'pg'

type GetDatabasePoolParams = {
  timeout_milliseconds?: number
}
export const getDatabasePool: (params?: GetDatabasePoolParams) => Pool = (params) => {
  return new Pool({
    host: process.env.CLOUD_SQL_CONNECTION_NAME
      ? `${process.env.DB_SOCKET_PATH || '/cloudsql'}/${process.env.CLOUD_SQL_CONNECTION_NAME}`
      : process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: Number(process.env.PGPORT),
    statement_timeout: params?.timeout_milliseconds ?? 60_000 // timeout statements after a while (milliseconds)
  })
}
