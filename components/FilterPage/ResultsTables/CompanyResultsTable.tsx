import * as React from 'react'
import Link from 'next/link'
import { convertCompanyViewDatabaseItemToItem, ICompanyViewDatabaseItem } from '../../../types/ICompanyView'
import { useEffect, useState } from 'react'
import { getYMD } from '../../../helpers/utils/DateUtils'

export const CompanyResultsTable: React.FC<{ matchingResults: ICompanyViewDatabaseItem[]; tableClassName: any }> = ({
  matchingResults,
  tableClassName
}) => {
  const [companies] = useState(matchingResults?.map(convertCompanyViewDatabaseItemToItem) ?? [])
  useEffect(() => {
    console.log(companies)
  }, [])
  return (
    <table className={tableClassName}>
      <thead>
        <tr>
          <th />
          <th style={{ minWidth: '20em' }}>Name</th>
          <th style={{ minWidth: '7em' }}>Location</th>
          <th style={{ minWidth: '4em' }}>Age</th>
          <th style={{ minWidth: '20em' }}>Officers</th>
          <th style={{ minWidth: '5em' }}>Last accounts date</th>
        </tr>
      </thead>
      <tbody>
        {companies.map((company, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>
              <Link href={'/company/' + company.companyNumber}>
                <a target={'_blank'}>{company.name}</a>
              </Link>
            </td>
            <td>{company.area}</td>
            <td>
              {company.dateOfCreation && (
                <>{Math.round((Date.now() - new Date(company.dateOfCreation).valueOf()) / 86400 / 365 / 1000)} years</>
              )}
            </td>
            <td>{company.officers?.join(' & ')}</td>
            <td>{getYMD(company.balanceSheetDate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
