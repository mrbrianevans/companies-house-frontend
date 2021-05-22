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
    signIn: '/signin',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/checkEmail', // (used for check email message)
    newUser: '/auth/newUser' // If set, new users will be directed here on first sign in
  },
  callbacks: {
    session: async (session, user) => {
      // this is to add in the user id to getSession() and useSession()
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
  },
  // this logs out auth events for logging monitoring
  events: {
    createUser: async (message) =>
      console.log(
        JSON.stringify({
          message: 'New user signed up',
          user: message.email,
          severity: 'INFO',
          class: 'auth'
        })
      ),
    signIn: async (message) =>
      console.log(
        JSON.stringify({
          message: 'User signed in',
          user: message.user.email,
          severity: 'DEBUG',
          class: 'auth'
        })
      ),
    error: async (message) =>
      console.log(
        JSON.stringify({
          message: 'Sign in error',
          errorObject: message,
          severity: 'ERROR',
          class: 'auth'
        })
      )
  }
})
