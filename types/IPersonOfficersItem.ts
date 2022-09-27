// generated typescript definitions from database using groovy script

/**
 * The schema of entities in the person_officers relation, with correct null safety
 */
export interface IPersonOfficersItem {
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
  officer_name_vector: string[]
}
