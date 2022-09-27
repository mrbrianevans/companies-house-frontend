import { IOfficerItem } from '../../types/IOfficer'
import { IAddress } from '../../types/IAddress'

export const getOfficerAddressFromItem: (officer: IOfficerItem) => IAddress = (officer) => {
  return {
    city: officer.postTown,
    county: officer.county,
    lat: 0,
    long: 0,
    postCode: officer.postCode,
    streetAddress: officer.addressLine1,
    country: officer.country
  }
}
