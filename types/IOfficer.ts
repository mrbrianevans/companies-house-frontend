import { IAddress } from './IAddress'

export interface IOfficer {
  personNumber: string
  address?: IAddress
  birthDate?: { year: number; month: number }
  title?: string
  forenames?: string
  surname: string
  nationality?: string
  occupation?: string
}
