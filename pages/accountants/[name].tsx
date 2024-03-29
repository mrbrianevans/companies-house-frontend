import { GetStaticPaths, GetStaticProps } from 'next'
import { ICompanyFullDetails, ICompanyProfile } from '../../types/ICompany'
import { Page } from '../../components/Page/Page'
import getAccountantProfile from '../../interface/accountant/getAccountantProfile'
import { IAccountant } from '../../types/IAccountant'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { getCompanyProfile } from '../../interface/company/getCompanyProfile'
import ClientCard from '../../components/Client/ClientCard'
import { useRouter } from 'next/router'
import { getFirstCompanyMatchByName } from '../../interface/api/getFirstCompanyMatchByName'
import { splitDate } from '../../helpers/utils/DateUtils'

const styles = require('../../styles/AccountantIndividual.module.sass')

interface props {
  accountantProfile: IAccountant
  companyProfile?: ICompanyFullDetails | null
}

const AccountantProfilePage = ({ accountantProfile, companyProfile }: props) => {
  const [clients, setClients] = useState<undefined | ICompanyProfile[]>()
  useEffect(() => {
    if (accountantProfile) {
      console.time('Fetch clients from API')
      axios.get('/api/accountants/getClients', { params: { name: accountantProfile.name_on_accounts } }).then((res) => {
        if (res.status === 200) {
          setClients(res.data)
          console.timeEnd('Fetch clients from API')
        } else console.error(res.statusText, res.data)
      })
    }
  }, [accountantProfile?.name_on_accounts])
  const clientLimitIntervals = 5
  const [clientLimit, setClientLimit] = useState(clientLimitIntervals)
  const router = useRouter()
  return (
    <Page>
      {router.isFallback ? (
        <p>Loading accountants details...</p>
      ) : (
        <>
          <h1>{accountantProfile.name_on_accounts}</h1>
          <div className={styles.mainContainer}>
            <div>
              View regular company page:{' '}
              <Link href={`/company/${companyProfile?.company.companyNumber}`}>
                <a>{companyProfile?.company.companyNumber}</a>
              </Link>
            </div>
            <div>Software: {accountantProfile.software}</div>
            <div>
              Founded in{' '}
              {companyProfile?.company.dateOfCreation &&
                splitDate(companyProfile?.company.dateOfCreation.valueOf()).year}
            </div>
            <div>
              Registered address: {companyProfile?.address.streetAddress}, {companyProfile?.address.city}
            </div>
            <div className={styles.clientContainer}>
              <p>
                Showing {clients ? clientLimit : 0} of {clients?.length ?? accountantProfile.number_of_clients} clients
              </p>
              {!clients && 'Loading list of clients'}
              {clients?.slice(0, clientLimit)?.map((client) => (
                //extract this into a separate component
                <ClientCard key={client.company_number} client={client} />
              ))}
              {clients && clientLimit < clients.length && (
                <button onClick={() => setClientLimit((prevState) => prevState + clientLimitIntervals)}>
                  Show more
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </Page>
  )
}

export default AccountantProfilePage

export const getStaticProps: GetStaticProps = async (context) => {
  const {
    params: { name: nameParam }
  } = context
  if (typeof nameParam != 'string') return { notFound: true }
  const name = decodeURIComponent(nameParam)
  // console.log('Requested accountant with name:', name)
  const accountantProfile = await getAccountantProfile(name)
  if (!accountantProfile) return { notFound: true }
  const returnProps: props = { accountantProfile }
  if (accountantProfile?.company_number) {
    returnProps.companyProfile = await getCompanyProfile(accountantProfile.company_number)
  } else {
    // get possible matches from companies house search API
    returnProps.companyProfile = await getFirstCompanyMatchByName({ name })
  }
  return {
    props: returnProps, // will be passed to the page component as props
    revalidate: 86400
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { fallback: true, paths: [] }
}
