// generated typescript definitions from database using groovy script

import { IOfficerItem } from './IOfficer'
import { ICompanyProfile } from './ICompany'
import { ICompaniesDatabaseItem, ICompaniesItem } from './ICompanies'
import { ICompanyViewItem } from './ICompanyView'
import { IWideAccountsCombinedDatabaseItem, IWideAccountsCombinedItem } from './IWideAccountsCombined'
import { IDetailedPostcodesDatabaseItem } from './IDetailedPostcodes'
import { IAddress } from './IAddress'

export interface IOfficerAppointmentsDatabaseItem {
  company_number?: string
  person_number?: string
  appointment_type?: string
  appointment_date?: string
}

export interface IOfficerAppointmentsItem {
  companyNumber?: string
  personNumber?: string
  appointmentType?: string
  // timestamp of appointment date (only accurate to the day)
  appointmentDate?: number
}

export function convertOfficerAppointmentsDatabaseItemToItem(
  databaseItem: IOfficerAppointmentsDatabaseItem
): IOfficerAppointmentsItem {
  if (!databaseItem) return null
  const item: IOfficerAppointmentsItem = {
    companyNumber: databaseItem.company_number,
    personNumber: databaseItem.person_number,
    appointmentType: databaseItem.appointment_type,
    appointmentDate: new Date(databaseItem.appointment_date).valueOf()
  }
  return item
}

export type IOfficerAppointmentWithCompany = IOfficerAppointmentsItem & ICompanyViewItem

export interface IOfficerAppointmentFullDetails {
  appointment: IOfficerAppointmentsItem
  company: ICompaniesItem
  sicCodes: string[]
  companyAccounts: IWideAccountsCombinedItem
  officerAddress: IAddress
  companyAddress: IAddress
}

export interface IOfficerAppointmentWithOfficer {
  appointment: IOfficerAppointmentsItem
  officerAddress: IAddress
  officer: IOfficerItem
}
