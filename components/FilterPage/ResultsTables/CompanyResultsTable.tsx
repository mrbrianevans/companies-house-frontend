import * as React from 'react'
import Link from 'next/link'
import { ICompanyViewItem } from '../../../types/ICompanyView'

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
                <Link href={'/company/' + company.companyNumber}>
                  <a target={'_blank'}>{company.companyNumber}</a>
                </Link>
              </td>
              <td>
                <Link href={'/company/' + company.companyNumber}>
                  <a target={'_blank'}>{company.name}</a>
                </Link>
              </td>
              <td>{company.area}</td>
              <td>
                {Math.round((Date.now() - new Date(company.dateOfCreation).valueOf()) / 86400 / 365 / 1000)} years
              </td>
              <td>{company.officers?.join(' & ')}</td>
              <td>{new Date(company.balanceSheetDate).toLocaleDateString()}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}
