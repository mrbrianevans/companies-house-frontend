import { Page } from '../../components/Page/Page'
import * as React from 'react'
import { useState } from 'react'
import { AccountantSearchBar } from '../../components/SearchBars/AccountantSearchBar'
import { FeatureList } from '../../components/lists/FeatureList'
import getFilterOptions from '../../interface/filter/getFilterOptions'
import { FilterCategory } from '../../types/FilterCategory'
import ButtonLink from '../../components/Inputs/ButtonLink'

const AccountantFilterPage = () => {
  const [accountantFilters] = useState(getFilterOptions({ category: FilterCategory.ACCOUNTANT }))
  return (
    <Page>
      <h1>Accountants</h1>
      <p>
        To filter accountants, visit <ButtonLink href={'/accountants/filter'} />
      </p>
      <p>Start off a filter searching by name:</p>
      <AccountantSearchBar />
      <h3>Available filters</h3>
      <FeatureList list={accountantFilters.map((filter) => filter.field)} />
      <h3>About this service</h3>
      <p>
        When companies file their annual accounts with Companies House, many include their accountants name and
        software. By collecting and combining all of these disclosures, its possible to build up a picture of the
        accounting market. This can be used, for example, to see which clients a particular accounting firm files annual
        accounts on behalf of, and what accounting software a particular firm uses.
      </p>
      <p>
        <b>Note: </b>Not all accounting firms put this disclosure on the accounts they file (or don't tag it in XBRL),
        which makes this data set incomplete. Furthermore, I have not scanned the full history of accounts filed made
        available by Companies House. So please bear in mind that the number of clients displayed on this system may not
        be representitave of the actual number of clients a firm has
      </p>
    </Page>
  )
}

export default AccountantFilterPage
