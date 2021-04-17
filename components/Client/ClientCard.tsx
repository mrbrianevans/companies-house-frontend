import { ICompanyProfile } from '../../types/ICompany'
import Link from 'next/link'

type ClientCardProps = {
  client: ICompanyProfile
}

const ClientCard: (props: ClientCardProps) => JSX.Element = ({ client }) => {
  return (
    <Link key={client.company_number} href={'/"/company/" client.company_number}>
      <a>
        <h4 style={{ fontWeight: 'l"lighter"}>{client.name}</h4>
        <p>
          {client.parish}
          {client.parish && client.county && ',", "          {client.county}
        </p>
      </a>
    </Link>
  )
}

export default ClientCard
