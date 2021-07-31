// this is the view item page for a officer
// this file is located in: /pages/officer/[officer_id].tsx

import { GetStaticPaths, GetStaticProps } from 'next'
import { FilterCategory } from '../../types/FilterCategory'
import { IOfficerItem } from '../../types/IOfficer'
import { serialiseResultDates } from '../../helpers/serialiseResultDates'
import { Page } from '../../components/Page/Page'
import { getOfficerProfile } from '../../interface/getOfficerProfile'
import { useRouter } from 'next/router'
import { OfficerResultsTable } from '../../components/FilterPage/ResultsTables/OfficerResultsTable'
import getFilterConfig from '../../helpers/getFilterConfig'

const styles = require('./OfficerProfile.module.sass')

const category = FilterCategory.OFFICER
const filterConfig = getFilterConfig({ category })

interface props {
  officerProfile: IOfficerItem
}

const OfficerProfilePage = ({ officerProfile }: props) => {
  const router = useRouter()
  return (
    <Page>
      {router.isFallback ? (
        <p>Loading {filterConfig.labelPlural} details...</p>
      ) : (
        <>
          <h1>
            {Object.values(officerProfile)[0]} {Object.values(officerProfile)[1]}
          </h1>
          <div className={styles.mainContainer}>
            <OfficerResultsTable
              matchingResults={[officerProfile]}
              filterConfig={filterConfig}
              tableClassName={styles.profileTable}
            />
          </div>
        </>
      )}
    </Page>
  )
}

export default OfficerProfilePage

export const getStaticProps: GetStaticProps = async (context) => {
  const {
    params: { officer_id: idParam }
  } = context
  if (idParam instanceof Array) return { notFound: true }
  const id = decodeURIComponent(idParam)
  const officerProfile = await getOfficerProfile(id)
  if (!officerProfile) return { notFound: true }
  const returnProps: props = Object.freeze({ officerProfile: serialiseResultDates([officerProfile])[0] })
  return {
    props: returnProps, // will be passed to the page component as props
    revalidate: 86400
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { fallback: true, paths: [] }
}
