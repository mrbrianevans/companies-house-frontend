import * as React from 'react'
import { IAccountant } from '../../../types/IAccountant'
import Link from 'next/link'

export const AccountantResultsTable: React.FC<{ matchingResults: IAccountant[]; tableClassName: any }> = ({
  matchingResults,
  tableClassName
}) => {
  return (
    <table style={{ width: '100%' }} className={tableClassName}>
      <thead>
        <tr>
          <th />
          <th>Name</th>
          <th>Company Number</th>
          <th>Location</th>
          <th>Age</th>
          <th>Software</th>
          <th>Number of clients</th>
        </tr>
      </thead>
      <tbody>
        {matchingResults?.map((accountant, index) => (
          <tr key={index}>
            <td style={{ textAlign: 'right' }}>
              <span style={{ paddingRight: 20, paddingLeft: 0 }}>{index + 1}</span>
            </td>
            <td>
              <Link href={'/accountants/' + encodeURIComponent(accountant.name_on_accounts)}>
                <a target={'_blank'}>{accountant.name_on_accounts}</a>
              </Link>
            </td>
            <td>
              <Link href={'/company/' + accountant.company_number}>
                <a target={'_blank'}>{accountant.company_number}</a>
              </Link>
            </td>
            <td>{accountant.area}</td>
            <td>
              {accountant.date !== null &&
                accountant.date !== undefined &&
                Math.round((Date.now() - new Date(accountant.date).valueOf()) / (86400 * 1000 * 365)) + 'years'}{' '}
            </td>
            <td>{accountant.software.split(' ').slice(0, 3).join(' ')}</td>
            <td>{accountant.number_of_clients}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
