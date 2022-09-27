// this file is located in: /ajax/officer/getOfficerAppointmentsForOfficer.ts

import {
  GetOfficerAppointmentsForOfficerOutput,
  GetOfficerAppointmentsForOfficerParams
} from '../../interface/officer/getOfficerAppointmentsForOfficer'

/** Frontend AJAX call to getOfficerAppointmentsForOfficer method on the backend
 *
 * @example
 * const { officerAppointments } = await $END$fetchGetOfficerAppointmentsForOfficer({ personNumber })
 */
export const fetchGetOfficerAppointmentsForOfficer: (
  params: GetOfficerAppointmentsForOfficerParams
) => Promise<GetOfficerAppointmentsForOfficerOutput> = async ({ personNumber }) => {
  return await fetch('/api/officer/getOfficerAppointmentsForOfficer', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ personNumber })
  })
    .then((r) => {
      if (r.status === 200) return r.json()
      console.error('Failed to call getOfficerAppointmentsForOfficer API endpoint')
      return null
    })
    .catch(console.error)
}
