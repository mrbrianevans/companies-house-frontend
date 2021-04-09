import { ICompanyProfile } from '../../types/ICompany'

type ClientCardProps = {
  client: ICompanyProfile
}

const ClientCard: (props: ClientCardProps) => JSX.Element = ({ client }) => {
  return (
    <div key={client.company_number}>
      <h4 style={{ fontWeight: 'lighter' }}>{client.name}</h4>
      <p>
        {client.parish}
        {client.parish && client.county && ', '}
        {client.county}
      </p>
    </div>
  )
}

export default ClientCard
