// generated typescript definitions from database using groovy script
import { FilterCategory } from './FilterCategory'

export interface IUserDatabaseItem {
  id: number
  name?: string
  email?: string
  email_verified?: number
  image?: string
  created_at: number
  updated_at: number
  name_updated?: number
  uid?: unknown
  role_code: UserRole
}

export interface IUserItem {
  id: number
  name?: string
  email?: string
  emailVerified?: number
  image?: string
  createdAt: number
  updatedAt: number
  nameUpdated?: number
  uid?: unknown
  roleCode: UserRole
}

export function convertUserDatabaseItemToItem(databaseItem: IUserDatabaseItem): IUserItem {
  const item = {
    id: databaseItem.id,
    name: databaseItem.name,
    email: databaseItem.email,
    emailVerified: databaseItem.email_verified,
    image: databaseItem.image,
    createdAt: databaseItem.created_at,
    updatedAt: databaseItem.updated_at,
    nameUpdated: databaseItem.name_updated,
    uid: databaseItem.uid,
    roleCode: databaseItem.role_code
  }
  return item
}
export enum UserRole {
  DEV = 'dev',
  UNPAID = 'unpaid_user',
  PAID = 'paid_user'
}
