import NextAuth from 'next-auth'
import { UserRole } from './IUser'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    user: {
      // @deprecated in favour of uid
      id: number
      // universally unique identifier of this user
      uid: string
      name: string
      email: string
      role: UserRole
    }
  }
  interface User {
    id: number
    name: string
    email: string
    emailVerified: Date
    image: null
    createdAt: Date
    updatedAt: Date
  }
}
