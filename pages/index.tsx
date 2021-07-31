import Link from 'next/link'
import { Page } from '../components/Page/Page'
import { TextInputWithButton } from '../components/Inputs/TextInputWithButton'
import { useRouter } from 'next/router'
import { useState } from 'react'
import ButtonLink from '../components/Inputs/ButtonLink'
import { useSession } from 'next-auth/client'
import { companyNumberRegex } from '../types/patterns/CompanyNumberRegex'

const styles = require('../styles/Home.module.css')
export default function Home() {
  const [session, loading] = useSession()
  return (
    <Page dontShowLogin>
      <div className={styles.featureBrowserGrid}>
        <div className={styles.searchBar} style={{ padding: 0 }}>
          <TextInputWithButton
            textBoxPlaceholder={'Company search'}
            buttonLink={getSearchLink}
            buttonText={'Search!'}
            textBoxId={'companyNumberSearchBox'}
            textBoxStyle={{ boxShadow: 'none', height: '2rem' }}
          />
          {!loading && !session && <ButtonLink href={'/auth/signin'} label={'Sign in!'} />}
        </div>
        <Link href={'/company/filter'}>
          <a draggable={'false'}>
            <h3>Filter companies</h3>
            <p>Filter all UK companies by parameters such as location, SIC code and name</p>
          </a>
        </Link>
        <Link href={'/search'}>
          <a draggable={'false'}>
            <h3>Search companies</h3>
            <p>Search for a company by name or company number</p>
          </a>
        </Link>
        <Link href={'/accountants/filter'}>
          <a draggable={'false'}>
            <h3>Filter accountants</h3>
            <p>
              This aggregates accountants disclosure on accounts to build a picture of how many clients an accountant
              has
            </p>
          </a>
        </Link>
        <Link href={'/accountants'}>
          <a draggable={'false'}>
            <h3>Search accountants</h3>
            <p>Search for an accounting practice by name</p>
          </a>
        </Link>
        <Link href={'/officer/filter'}>
          <a draggable={'false'}>
            <h3>Filter officers</h3>
            <p>Filter officers by age</p>
          </a>
        </Link>
        <Link href={'/officer/search'}>
          <a draggable={'false'}>
            <h3>Search officers</h3>
            <p>Search for an officer by name</p>
          </a>
        </Link>
        <div className={styles.aboutCard}>
          <h3>About</h3>
          <p>
            Every company in the UK is compelled by law to file annual accounts with Companies House, who then makes
            these publicly available. This is a facility to filter UK companies using the data from companies house
          </p>
        </div>
      </div>
    </Page>
  )
}

const getSearchLink = (value: string) => {
  if (value.match(companyNumberRegex)) return 'company/' + encodeURIComponent(value)
  else return '/search' + (value ? '/' + encodeURIComponent(value) : '')
}
