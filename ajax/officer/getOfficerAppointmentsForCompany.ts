// this file is located in: /ajax/officer/getOfficerAppointmentsForCompany.ts

import {
  GetOfficerAppointmentsForCompanyParams,
  GetOfficerAppointmentsForCompanyOutput
} from '../../interface/officer/getOfficerAppointmentsForCompany'

/** Frontend AJAX call to getOfficerAppointmentsForCompany method on the backend
 *
 * @example
 * const { officers } = await $END$fetchGetOfficerAppointmentsForCompany({ companyNumber })
 */
export const fetchGetOfficerAppointmentsForCompany: (
  params: GetOfficerAppointmentsForCompanyParams
) => Promise<GetOfficerAppointmentsForCompanyOutput> = async ({ companyNumber }) => {
  return await fetch('/api/officer/getOfficerAppointmentsForCompany', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ companyNumber })
  })
    .then((r) => {
      if (r.status === 200) return r.json()
      console.error('Failed to call getOfficerAppointmentsForCompany API endpoint')
      return null
    })
    .catch(console.error)
}
