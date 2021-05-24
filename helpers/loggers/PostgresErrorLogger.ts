export const logPostgresError = (e: PostgresError) => {
  console.error(
    JSON.stringify({
      severity: 'ERROR',
      message: 'Psql Error: ' + e.message,
      errno: e.errno,
      code: e.code
    })
  )
}

type PostgresError = {
  message: string
  errno: string
  code: string
}
