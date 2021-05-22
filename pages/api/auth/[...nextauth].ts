import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    Providers.Email({
      type: 'email',
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    })
  ],
  database: {
    host: process.env.CLOUD_SQL_CONNECTION_NAME
      ? `${process.env.DB_SOCKET_PATH || '/cloudsql'}/${process.env.CLOUD_SQL_CONNECTION_NAME}`
      : process.env.PGHOST,
    //@ts-ignore
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: Number(process.env.PGPORT),
    type: 'postgres'
  },
  pages: {
    //todo: setup these custom pages
    // signIn: '/signin',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: null // If set, new users will be directed here on first sign in
  },
  callbacks: {
    session: async (session, user) => {
      return Promise.resolve(
        Object.assign(session, {
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        })
      )
    }
  }
})
