import { Page } from '../../components/Page/Page'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import { getUserSavedFilters } from '../../interface/user/getUserSavedFilters'
import { IUserFilterDisplay } from '../../types/IUserFilter'
import ButtonLink from '../../components/Inputs/ButtonLink'
import Button from '../../components/Inputs/Button'
import { useState } from 'react'

type Props = { savedFilters: IUserFilterDisplay[] }
const SavedFilters = ({ savedFilters }: Props) => {
  const [downloadLink, setDownloadLink] = useState<string>()
  return (
    <Page>
      <h1>Saved filters</h1>
      {downloadLink && (
        <p>
          Download CSV here: <a href={downloadLink}>{downloadLink}</a>
        </p>
      )}
      <div>
        {savedFilters?.map((savedFilter) => (
          <div key={savedFilter.userFilterId}>
            <p>
              <b>English: </b>
              {savedFilter.english}
            </p>
            <p>Category: {savedFilter.category}</p>
            <p>Saved on {new Date(savedFilter.dateSaved).toDateString()}</p>
            <p>
              View filter: <ButtonLink href={savedFilter.urlToFilter} label={savedFilter.savedFilterCode} />
            </p>
            <Button
              label={'Download CSV'}
              onClick={() => {
                fetch('/api/filter/downloadCsv?id=' + savedFilter.userFilterId)
                  .then((r) => r.json())
                  .then((j) => setDownloadLink(j.link))
                  .catch(console.error)
              }}
            />{' '}
            <span>({savedFilter.resultCount ?? 'Unknown number of'} companies)</span>
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
