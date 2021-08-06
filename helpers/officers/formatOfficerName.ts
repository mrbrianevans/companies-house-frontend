import { IOfficerItem } from '../../types/IOfficer'

export const formatOfficerName = (officer: IOfficerItem) => {
  return `${officer?.title ?? ''} ${officer?.forenames ?? ''} ${officer.surname ?? ''}`
}
