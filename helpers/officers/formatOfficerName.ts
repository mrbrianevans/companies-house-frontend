import { IOfficerItem } from '../../types/IOfficer'
import { capitalizeEveryWord } from '../StringManipulation'

export const formatOfficerName = (officer: IOfficerItem) => {
  return capitalizeEveryWord(`${officer?.title ?? ''} ${officer?.forenames ?? ''} ${officer.surname ?? ''}`)
}
