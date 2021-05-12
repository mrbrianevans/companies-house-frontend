import { Page } from '../../components/Page/Page'
import * as React from 'react'
import Link from 'next/link'

const AccountantFilterPage = () => {
  return (
    <Page>
      <h1>Accountants</h1>
      <p>
        To filter accountants, visit{' '}
        <Link href={'/accountants/filter'}>
          <a>/filter</a>
        </Link>
      </p>
    </Page>
  )
}

export default AccountantFilterPage
