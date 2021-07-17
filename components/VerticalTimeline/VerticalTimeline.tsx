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
          <p>VerticalTimeline data has loaded</p>
          {events?.map((e, i) => (
            <li key={i}>{e.title}</li>
          ))}
        </>
      )}
    </div>
  )
}

export interface ITimelineEvent {
  // milliseconds since epoch
  timestamp: number
  title: string
  description: string
}
