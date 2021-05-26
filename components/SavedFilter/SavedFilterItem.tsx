import * as React from 'react'
import ButtonLink from '../Inputs/ButtonLink'
import { IUserFilterDisplay } from '../../types/IUserFilter'

type Props = {
  savedFilter: IUserFilterDisplay
}

export const SavedFilterItem: React.FC<Props> = ({ savedFilter }) => {
  return (
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
      <ButtonLink
        href={'/api/filter/downloadCsv?id=' + savedFilter.userFilterId}
        aProps={{
          target: '_blank',
          download: 'companies-download.csv'
        }}>
        Download CSV
      </ButtonLink>{' '}
      <span>({savedFilter.resultCount ?? 'Unknown number of'} companies)</span>
    </div>
  )
}
