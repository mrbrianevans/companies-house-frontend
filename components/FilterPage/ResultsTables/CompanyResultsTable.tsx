import * as React from 'react'
import Link from 'next/link'
import { ICompanyProfile } from '../../../types/ICompany'

export const CompanyResultsTable: React.FC<{ matchingResults: ICompanyProfile[]; tableClassName: any }> = ({
  matchingResults,
  tableClassName
}) => {
  return (
    <table className={tableClassName}>
      <thead>
        <tr>
          <th />
          <th>Company number</th>
          <th>Name</th>
          <th>Age</th>
          <th>Type of company</th>
        </tr>
      </thead>
      <tbody>
        {matchingResults?.length > 0 &&
          matchingResults.map((company, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>
                <Link href={'/company/' + company.company_number}>
                  <a target={'_blank'}>{company.company_number}</a>
                </Link>
              </td>
              <td>{company.name}</td>
              <td>
                {Math.round((Date.now() - new Date(company.date_of_creation).valueOf()) / 86400 / 365 / 1000)} years
              </td>
              <td>{company.category}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}
