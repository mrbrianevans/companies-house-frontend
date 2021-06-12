import * as React from 'react'
import Link from 'next/link'
import { ICompanyViewItem } from '../../../types/ICompanyViewItem'

export const CompanyResultsTable: React.FC<{ matchingResults: ICompanyViewItem[]; tableClassName: any }> = ({
  matchingResults,
  tableClassName
}) => {
  return (
    <table className={tableClassName}>
      <thead>
        <tr>
          <th />
          <th style={{ minWidth: '5em' }}>Company number</th>
          <th style={{ minWidth: '20em' }}>Name</th>
          <th style={{ minWidth: '7em' }}>Location</th>
          <th style={{ minWidth: '4em' }}>Age</th>
          <th style={{ minWidth: '20em' }}>Officers</th>
          <th style={{ minWidth: '5em' }}>Last accounts date</th>
        </tr>
      </thead>
      <tbody>
        {matchingResults?.length > 0 &&
          matchingResults.map((company, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <Link href={'/company/' + company.company_number}>
                  <a target={'_blank'}>{company.company_number}</a>
                </Link>
              </td>
              <td>
                <Link href={'/company/' + company.company_number}>
                  <a target={'_blank'}>{company.name}</a>
                </Link>
              </td>
              <td>{company.area}</td>
              <td>
                {Math.round((Date.now() - new Date(company.date_of_creation).valueOf()) / 86400 / 365 / 1000)} years
              </td>
              <td>{company.officers?.join(' & ')}</td>
              <td>{new Date(company.balance_sheet_date).toLocaleDateString()}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}
