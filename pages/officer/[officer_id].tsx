// this is the view item page for a officer
// this file is located in: /pages/officer/[officer_id].tsx

import { GetStaticPaths, GetStaticProps } from 'next'
import { FilterCategory } from '../../types/FilterCategory'
import { IOfficerItem } from '../../types/IOfficer'
import { serialiseResultDates } from '../../helpers/serialiseResultDates'
import { Page } from '../../components/Page/Page'
import { getOfficerProfile } from '../../interface/getOfficerProfile'
import { useRouter } from 'next/router'
import getFilterConfig from '../../helpers/getFilterConfig'
import { OfficerProfile } from '../../components/OfficerProfile/OfficerProfile'
import { useEffect, useState } from 'react'
import { fetchGetOfficerAppointmentsForOfficer } from '../../ajax/officer/getOfficerAppointmentsForOfficer'
import { IOfficerAppointmentFullDetails } from '../../types/IOfficerAppointments'

const category = FilterCategory.OFFICER
const filterConfig = getFilterConfig({ category })

interface props {
  officerProfile: IOfficerItem
}

const OfficerProfilePage = ({ officerProfile }: props) => {
  const router = useRouter()
  const [officerAppointments, setOfficerAppointments] = useState<IOfficerAppointmentFullDetails[]>()
  useEffect(() => {
    if (typeof router.query.officer_id === 'string') {
      fetchGetOfficerAppointmentsForOfficer({ personNumber: router.query.officer_id }).then((r) => {
        if (r) setOfficerAppointments(r.officerAppointments)
      })
    }
  }, [router.query.officer_id])
  return (
    <Page>
      <OfficerProfile
        loading={router.isFallback}
        officer={officerProfile}
        appointments={officerAppointments}
        appointmentsLoading={officerAppointments === undefined}
      />
    </Page>
  )
}

export default OfficerProfilePage

export const getStaticProps: GetStaticProps = async (context) => {
  const {
    params: { officer_id: idParam }
  } = context
  if (idParam instanceof Array || idParam.length !== 12) return { notFound: true }
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
