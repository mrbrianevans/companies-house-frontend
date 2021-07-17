export interface IPerson {
  name: string
  // zero indexed, eg January=0, February=1 etc
  birth_month?: number
  birth_year?: number
  firstName?: string
  lastName?: string
  middleNames?: string
  title?: string
  personNumber?: string
}
