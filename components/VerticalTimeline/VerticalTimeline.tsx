import { capitalizeEveryWord } from '../../helpers/utils/StringUtils'
import { getYMD, splitDate } from '../../helpers/utils/DateUtils'
import { useEffect, useState } from 'react'

const styles = require('./VerticalTimeline.module.scss')

type VerticalTimelineProps = {
  loading?: boolean
  events?: ITimelineEvent[]
  // the date the company was incorporated on
  incorporationDate?: string | number
}

export const VerticalTimeline: (props: VerticalTimelineProps) => JSX.Element = ({
  loading,
  events,
  incorporationDate
}) => {
  const [dob, setDob] = useState<{ month: string; year: number; day: number }>()
  useEffect(() => {
    if (incorporationDate) setDob(splitDate(incorporationDate))
  }, [incorporationDate])
  return (
    <div className={styles.container}>
      {loading ? (
        'loading data for VerticalTimeline'
      ) : (
        <>
          <h4>Timeline of company history</h4>
          {dob && (
            <p>
              Founded on {dob.day} {dob.month} {dob.year}
            </p>
          )}
          {events?.map((event, i) => (
            <TimelineEvent key={i} timestamp={event.timestamp} title={event.title} description={event.description} />
          ))}
        </>
      )}
    </div>
  )
}

const TimelineEvent = (event: ITimelineEvent) => {
  const { month, year } = splitDate(event.timestamp)
  return (
    <div className={styles.timelineEvent}>
      <div className={styles.date}>
        <div className={styles.dateBlock}>
          <span className={styles.month}>{month.slice(0, 3)}</span>
          <span className={styles.year}>{year}</span>
        </div>
      </div>
      <h5 className={styles.title}>{capitalizeEveryWord(event.title)}</h5>
      <p className={styles.description}>{event.description}</p>
    </div>
  )
}

export interface ITimelineEvent {
  // milliseconds since epoch
  timestamp: number
  title: string
  description: string
}
