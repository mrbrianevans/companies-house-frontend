// generated typescript definitions from database using groovy script

import { IOfficerItem } from './IOfficer'
import { ICompanyProfile } from './ICompany'
import { ICompaniesDatabaseItem } from './ICompanies'
import { ICompanyViewItem } from './ICompanyView'
import { IWideAccountsCombinedDatabaseItem, IWideAccountsCombinedItem } from './IWideAccountsCombined'
import { IDetailedPostcodesDatabaseItem } from './IDetailedPostcodes'
import { IAddress } from './IAddress'

export interface IOfficerAppointmentsDatabaseItem {
  company_number?: string
  person_number?: string
  appointment_type?: string
  appointment_date?: Date
}

export interface IOfficerAppointmentsItem {
  companyNumber?: string
  personNumber?: string
  appointmentType?: string
  appointmentDate?: Date
}

export function convertOfficerAppointmentsDatabaseItemToItem(
  databaseItem: IOfficerAppointmentsDatabaseItem
): IOfficerAppointmentsItem {
  if (!databaseItem) return null
  const item = {
    companyNumber: databaseItem.company_number,
    personNumber: databaseItem.person_number,
    appointmentType: databaseItem.appointment_type,
    appointmentDate: databaseItem.appointment_date
  }
  return item
}

export type IOfficerAppointmentWithOfficer = IOfficerAppointmentsItem & IOfficerItem
export type IOfficerAppointmentWithCompany = IOfficerAppointmentsItem & ICompanyViewItem

export interface IOfficerAppointmentFullDetails {
  appointment: IOfficerAppointmentsItem
  company: ICompaniesDatabaseItem
  sicCodes: string[]
  companyAccounts: IWideAccountsCombinedItem
  officerAddress: IAddress
  companyAddress: IAddress
}
