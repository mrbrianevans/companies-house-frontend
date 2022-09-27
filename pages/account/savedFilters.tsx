import { Page } from '../../components/Page/Page'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import { getUserSavedFilters } from '../../interface/user/getUserSavedFilters'
import { IUserFilterDisplay } from '../../types/IUserFilter'
import { SavedFilterItem } from '../../components/SavedFilter/SavedFilterItem'
import { getUser } from '../../interface/user/getUser'

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
  const user = await getUser({ session })
  // @ts-ignore this needs to be fixed! define a helper function to get more info about a user on the backend
  const savedFilters = await getUserSavedFilters(user.id)
  const props: Props = { savedFilters }
  return { props }
}
