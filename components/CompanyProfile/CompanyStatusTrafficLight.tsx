const styles = require('./CompanyStatusTrafficLight.module.scss')

type CompanyStatusTrafficLightProps = {
  loading?: boolean
  status?: string
}

export const CompanyStatusTrafficLight: (props: CompanyStatusTrafficLightProps) => JSX.Element = ({
  loading,
  status: statusString
}) => {
  const status: Status = lowerCaseStatusStringToEnum.get(statusString?.toLowerCase()) ?? Status.other
  const amber =
    status === Status.in_administration ||
    status === Status.liquidation ||
    status === Status.active_proposal_to_strike_off ||
    status === Status.other
  return (
    <div className={styles.container}>
      <h4>Company status</h4>
      <SingleLight label={Status.active} colour={'#2ecc71'} selected={!loading && status === Status.active} />
      <SingleLight
        label={!loading && amber ? status : Status.liquidation}
        colour={'#F79F1F'}
        selected={!loading && amber}
      />
      <SingleLight label={Status.dissolved} colour={'#e84118'} selected={!loading && status === Status.dissolved} />
    </div>
  )
}

const SingleLight = ({ colour, selected, label }: { colour: string; selected: boolean; label: string }) => {
  const circleSize = 20 //pixels
  return (
    <div className={styles.singleLight}>
      <svg height={circleSize} width={circleSize}>
        <circle
          r={circleSize / 2}
          cx={circleSize / 2}
          cy={circleSize / 2}
          fill={colour}
          className={selected ? styles.selected : styles.notSelected}
        />{' '}
      </svg>{' '}
      <span className={selected ? styles.selected : styles.notSelected}>{label}</span>
    </div>
  )
}

/* Constants from Companies House Github page: https://github.com/companieshouse/api-enumerations/blob/master/constants.yml
company_status:
  'active' : "Active"
  'dissolved' : "Dissolved"
  'liquidation' : "Liquidation"
  'receivership' : "Receiver Action"
  'converted-closed' : "Converted / Closed"
  'voluntary-arrangement' : "Voluntary Arrangement"
  'insolvency-proceedings' : "Insolvency Proceedings"
  'administration' : "In Administration"
  'open' : "Open"
  'closed' : "Closed"
 */
enum Status {
  active = 'Active',
  dissolved = 'Dissolved',
  liquidation = 'Liquidation',
  active_proposal_to_strike_off = 'Active (proposal to strike off)',
  in_administration = 'In administration',
  other = 'Other'
}

const lowerCaseStatusStringToEnum = new Map<string, Status>([
  ['active', Status.active],
  ['dissolved', Status.dissolved],
  ['liquidation', Status.liquidation],
  ['active - proposal to strike off', Status.active_proposal_to_strike_off],
  ['in administration', Status.in_administration],
  ['administration', Status.in_administration]
])
