import { DefaultSession, DefaultUser } from 'next-auth'
import { Timer } from '../../helpers/Timer'
import { getDatabasePool } from '../../helpers/connectToDatabase'
import camelcaseKeys from 'camelcase-keys'

type GetUserProfileParams = {
  session?: DefaultSession
}

export interface UserProfile {
  id: number
  name?: string
  email: string
  emailVerified: Date
  createdAt: Date
}

/**
 * Gets the user profile of a user by their session object.
 *
 * If there is no session, returns null. Otherwise, a user profile
 * @param session DefaultSession object from getSession()
 * @example  with request object in API route
 * const session = await getSession({ req })
 * const user = await getUserProfile({session})
 * @example  with context in getServerSideProps
 * const session = await getSession(context)
 * const user = await getUserProfile({session})
 */
export const getUser: (params: GetUserProfileParams) => Promise<UserProfile> = async ({ session }) => {
  if (!session) {
    return null
  }
  const timer = new Timer({
    label: 'Query database to getUserProfile with email address',
    filename: '/interface/user/getUserProfile.ts'
  })
  const pool = getDatabasePool()
  const { rows, rowCount } = await pool.query(
    `
  SELECT id, name, email, email_verified, created_at
  FROM users
  WHERE email=$1
  `,
    [session.user.email]
  )
  timer.flush()
  if (rowCount !== 1) return null
  else {
    return camelcaseKeys(rows[0])
  }
}
