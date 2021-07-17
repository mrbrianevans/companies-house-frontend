import { capitalizeEveryWord } from '../../helpers/StringManipulation'

const styles = require('./VerticalTimeline.module.scss')

type VerticalTimelineProps = {
  loading?: boolean
  events?: ITimelineEvent[]
}

export const VerticalTimeline: (props: VerticalTimelineProps) => JSX.Element = ({ loading, events }) => {
  return (
    <div className={styles.container}>
      {loading ? (
        'loading data for VerticalTimeline'
      ) : (
        <>
          <h4>Timeline of company history</h4>
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
          <span className={styles.month}>{month}</span>
          <span className={styles.year}>{year}</span>
        </div>
      </div>
      <h5 className={styles.title}>{capitalizeEveryWord(event.title)}</h5>
      <p className={styles.description}>{event.description}</p>
    </div>
  )
}
const splitDate = (timestamp: number) => {
  const monthIndex = new Date(timestamp).getUTCMonth()
  const month = months[monthIndex]
  const year = new Date(timestamp).getUTCFullYear()
  const day = new Date(timestamp).getUTCDate()
  return { day, month, year }
}
export interface ITimelineEvent {
  // milliseconds since epoch
  timestamp: number
  title: string
  description: string
}
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
