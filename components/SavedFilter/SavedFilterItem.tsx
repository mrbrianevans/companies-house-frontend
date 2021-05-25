import * as React from 'react'
import ButtonLink from '../Inputs/ButtonLink'
import Button from '../Inputs/Button'
import { IUserFilterDisplay } from '../../types/IUserFilter'
import { useState } from 'react'

type Props = {
  savedFilter: IUserFilterDisplay
}
enum DownloadStatus {
  NOT_STARTED = 'Generate CSV download',
  BUSY_GENERATING = 'Generating...',
  DOWNLOAD_READY = 'Download CSV file',
  DOWNLOAD_COMPLETE = 'Download finished',
  FAILED = 'Failed to prepare CSV'
}

export const SavedFilterItem: React.FC<Props> = ({ savedFilter }) => {
  const [downloadLink, setDownloadLink] = useState<string>()
  const [status, setStatus] = useState<DownloadStatus>(DownloadStatus.NOT_STARTED)
  const [downloadTaken, setDownloadTaken] = useState<number>()
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
      {status === DownloadStatus.NOT_STARTED && (
        <Button
          label={'Generate CSV download'}
          onClick={() => {
            setStatus(DownloadStatus.BUSY_GENERATING)
            setDownloadTaken(0)
            const interval = 1000
            const timer = setInterval(() => setDownloadTaken((prev) => prev + interval), interval)
            fetch('/api/filter/downloadCsv?id=' + savedFilter.userFilterId)
              .then((r) => {
                if (!r.ok) throw new Error('failed to fetch CSV')
                return r.blob()
              })
              .then((b) => {
                setDownloadLink(URL.createObjectURL(b))
                setStatus(DownloadStatus.DOWNLOAD_READY)
                clearInterval(timer)
              })
              .catch((e) => {
                console.error(e)
                setStatus(DownloadStatus.FAILED)
              })
          }}
        />
      )}
      {status === DownloadStatus.DOWNLOAD_READY && (
        <ButtonLink href={downloadLink} aProps={{ download: 'companies-download.csv' }}>
          {status}
        </ButtonLink>
      )}{' '}
      {(status === DownloadStatus.DOWNLOAD_READY || status === DownloadStatus.NOT_STARTED) && (
        <span>({savedFilter.resultCount ?? 'Unknown number of'} companies)</span>
      )}
      {status === DownloadStatus.BUSY_GENERATING && (
        <p>
          {status} ({downloadTaken / 1000} seconds)
        </p>
      )}
      {status === DownloadStatus.DOWNLOAD_COMPLETE && <p>{status} </p>}
      {status === DownloadStatus.FAILED && <p style={{ color: 'crimson' }}>{status}</p>}
    </div>
  )
}
