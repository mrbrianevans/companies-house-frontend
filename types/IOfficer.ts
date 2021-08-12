// generated typescript definitions from database using groovy script

export interface IOfficerDatabaseItem {
  person_number: string
  post_code?: string
  birth_date?: Date
  title?: string
  forenames?: string
  surname: string
  honours?: string
  care_of?: string
  po_box?: string
  address_line_1?: string
  address_line_2?: string
  post_town?: string
  county?: string
  country?: string
  occupation?: string
  nationality?: string
  usual_residential_country?: string
  officer_name_vector?: unknown
}

export interface IOfficerItem {
  personNumber: string
  postCode?: string
  // timestamp in milliseconds
  birthDate?: number
  title?: string
  forenames?: string
  surname: string
  honours?: string
  careOf?: string
  poBox?: string
  addressLine1?: string
  addressLine2?: string
  postTown?: string
  county?: string
  country?: string
  occupation?: string
  nationality?: string
  usualResidentialCountry?: string
  officerNameVector?: unknown
}
export type BirthDateObject = { month: number; year: number }
export function convertOfficerDatabaseItemToItem(databaseItem: IOfficerDatabaseItem): IOfficerItem {
  console.log(databaseItem.birth_date, typeof databaseItem.birth_date)
  const item: IOfficerItem = {
    personNumber: databaseItem.person_number,
    postCode: databaseItem.post_code,
    // set date so that timezone doesn't affect the month. Day is always inaccurate
    birthDate: new Date(databaseItem.birth_date)?.setDate(15) ?? null,
    title: databaseItem.title,
    forenames: databaseItem.forenames,
    surname: databaseItem.surname,
    honours: databaseItem.honours,
    careOf: databaseItem.care_of,
    poBox: databaseItem.po_box,
    addressLine1: databaseItem.address_line_1,
    addressLine2: databaseItem.address_line_2,
    postTown: databaseItem.post_town,
    county: databaseItem.county,
    country: databaseItem.country,
    occupation: databaseItem.occupation,
    nationality: databaseItem.nationality,
    usualResidentialCountry: databaseItem.usual_residential_country,
    officerNameVector: databaseItem.officer_name_vector
  }
  return item
}
