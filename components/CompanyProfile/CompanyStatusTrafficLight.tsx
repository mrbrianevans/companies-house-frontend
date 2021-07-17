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
  return (
    <div className={styles.container}>
      {loading ? 'loading data for CompanyStatusTrafficLight' : 'CompanyStatusTrafficLight data has loaded: ' + status}
    </div>
  )
}

enum Status {
  active = 'active',
  dissolved = 'dissolved',
  liquidation = 'liquidation',
  active_proposal_to_strike_off = 'active_proposal_to_strike_off',
  in_administration = 'in_administration',
  other = 'other'
}

const lowerCaseStatusStringToEnum = new Map<string, Status>([
  ['active', Status.active],
  ['dissolved', Status.dissolved],
  ['liquidation', Status.liquidation],
  ['active - proposal to strike off', Status.active_proposal_to_strike_off],
  ['in administration', Status.in_administration]
])
