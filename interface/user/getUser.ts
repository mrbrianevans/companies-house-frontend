import { DefaultSession } from 'next-auth'
import { Timer } from '../../helpers/Timer'
import { getDatabasePool } from '../../helpers/connectToDatabase'
import { convertUserDatabaseItemToItem, IUserDatabaseItem, IUserItem } from '../../types/IUser'

type GetUserProfileParams = {
  session?: DefaultSession
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
export const getUser: (params: GetUserProfileParams) => Promise<IUserItem> = async ({ session }) => {
  if (!session) {
    return null
  }
  const timer = new Timer({
    label: 'Query database to getUserProfile with email address',
    filename: '/interface/user/getUserProfile.ts'
  })
  const pool = getDatabasePool()
  const user: IUserDatabaseItem = await pool
    .query(
      `
  SELECT id, name, email, email_verified, created_at, role_code
  FROM users
  WHERE email=$1
  `,
      [session.user.email]
    )
    .then(({ rows }) => rows[0])
    .catch(timer.postgresError)
  timer.flush()
  if (!user) return null
  else {
    return convertUserDatabaseItemToItem(user)
  }
}
