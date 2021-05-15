import { IFilter } from '../types/IFilters'
const hash = require('object-hash')

/**
 * Returns an ID for the filters
 *
 * The ID is calculated by hashing the object with md5. It is then shrunk using
 * modulus to a maximum of 1 bil combinations. This results in a 5 letter b64.
 * @param filters the filters to hash for ID
 */
export const getFilterId = (filters: IFilter[]) => {
  // sorts the filters so that a different order doesn't give a different filter
  const hashString: string = hash(filters.sort(), { algorithm: 'md5', encoding: 'hex' })
  //uses custom base 64 encoding to make it url safe, don't use the built in one
  const maximum = 1073741823
  const minimum = 16777216
  const decimal = (Number('0x' + hashString) % (maximum - minimum)) + minimum
  //conver the decimal to a URL-safe base64 to shorten its length
  const base64 = Base64Model.encode(decimal)
  return base64
}

//convert to and from a custom url-safe base64
const Base64Model = {
  encode: (decimal: number) => {
    const order: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-'
    const base: number = order.length
    let str: string = ''
    let r: number
    while (decimal) {
      r = decimal % base
      decimal -= r
      decimal /= base
      str = order.charAt(r) + str
    }
    return str
  },
  decode: (representation: string) => {
    const order: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-'
    const base: number = order.length
    let num: number = 0
    let r: number
    while (representation.length) {
      r = order.indexOf(representation.charAt(0))
      representation = representation.substr(1)
      num *= base
      num += r
    }
    return num
  }
}
