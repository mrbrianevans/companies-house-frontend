import { Page } from '../../components/Page/Page'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import { getUserSavedFilters } from '../../interface/user/getUserSavedFilters'
import { IUserFilterDisplay } from '../../types/IUserFilter'
import ButtonLink from '../../components/Inputs/ButtonLink'
import Button from '../../components/Inputs/Button'
import { useState } from 'react'
import { SavedFilterItem } from '../../components/SavedFilter/SavedFilterItem'

type Props = { savedFilters: IUserFilterDisplay[] }
const SavedFilters = ({ savedFilters }: Props) => {
  return (
    <Page>
      <h1>Saved filters</h1>
      <div>
        {savedFilters?.map((savedFilter) => (
          <SavedFilterItem key={savedFilter.userFilterId} savedFilter={savedFilter} />
        ))}
      </div>
    </Page>
  )
}

export default SavedFilters

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (!session) {
    return { notFound: true }
  }
  const savedFilters = await getUserSavedFilters(session.user.id)
  const props: Props = { savedFilters }
  return { props }
}
