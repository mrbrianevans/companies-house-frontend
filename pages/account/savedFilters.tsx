import { Page } from '../../components/Page/Page'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import { getUserSavedFilters } from '../../interface/user/getUserSavedFilters'
import { IUserFilterDisplay } from '../../types/IUserFilter'
import ButtonLink from '../../components/Inputs/ButtonLink'
type Props = { savedFilters: IUserFilterDisplay[] }
const SavedFilters = ({ savedFilters }: Props) => {
  return (
    <Page>
      <h1>Saved filters</h1>
      <div>
        {savedFilters?.map((savedFilter) => (
          <div>
            <p>
              <b>English: </b>
              {savedFilter.english}
            </p>
            <p>Category: {savedFilter.category}</p>
            <p>Saved on {new Date(savedFilter.dateSaved).toDateString()}</p>
            <p>
              View filter: <ButtonLink href={savedFilter.urlToFilter} label={savedFilter.savedFilterCode} />
            </p>
          </div>
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
