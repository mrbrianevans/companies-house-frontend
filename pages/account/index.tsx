import { Page } from '../../components/Page/Page'
import { signOut, useSession } from 'next-auth/client'
import ButtonLink from '../../components/Inputs/ButtonLink'
import Button from '../../components/Inputs/Button'
import { TextInputWithButton } from '../../components/Inputs/TextInputWithButton'
import { useEffect, useState } from 'react'

const AccountPage = () => {
  const [session, loading] = useSession()
  // this is whether or not the latest typed name has been saved
  const [savedName, setSavedName] = useState<boolean>()
  // this is the actual name that has been saved
  const [nameSaved, setNameSaved] = useState<string>()
  useEffect(() => {
    if (session && session.user) {
      setNameSaved(session.user.name)
      setSaveNameButtonText(session.user.name.length > 0 ? 'Saved' : 'Set name')
    }
  }, [session?.user?.name])
  const [timestampOfLastestRequest, setTimestampOfLastestRequest] = useState<number>(Date.now())
  const [saveNameButtonText, setSaveNameButtonText] = useState('Set name')
  const updateName = (name: string) => {
    setSavedName(false)
    const timestamp = Date.now()
    setTimestampOfLastestRequest(timestamp)
    setSaveNameButtonText('Saving')
    if (name === nameSaved)
      return new Promise((resolve) => setTimeout(resolve, 500)).then(() =>
        setSaveNameButtonText(name.length > 0 ? 'Saved' : 'Set name')
      )
    return new Promise((resolve, reject) => {
      fetch('/api/user/setName', {
        headers: { 'content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ name, timestamp })
      }).then((r) => {
        // timestamp prevents a slower request overriding a more recent one
        if (r.status === 200 && timestamp > timestampOfLastestRequest) {
          setSavedName(true)
          setNameSaved(name)
          setSaveNameButtonText(name.length > 0 ? 'Saved' : 'Set name')
          resolve(name)
        }
      })
    })
  }
  return (
    <Page dontShowLogin dontShowLogout>
      <h1>My Account</h1>
      {!loading &&
        (session ? (
          <>
            <p>You are signed in with {session.user.email}</p>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>Name:&nbsp;</span>
              <TextInputWithButton
                textBoxPlaceholder={'Your name'}
                buttonText={saveNameButtonText}
                textBoxStyle={{ fontSize: '1rem' }}
                buttonStyle={{ fontSize: '1rem', padding: '0.5rem 1.5rem' }}
                buttonOnClick={(name) => updateName(name)}
                initialValue={session.user.name}
                buttonProps={{ children: saveNameButtonText }}
                textBoxOnChange={(v) =>
                  setSaveNameButtonText(nameSaved.length === 0 ? 'Set name' : v === nameSaved ? 'Saved' : 'Save')
                }
              />{' '}
            </div>
            <p>
              View your saved filters: <ButtonLink href={'/account/savedFilters'} label={'Saved filters'} />
            </p>
            <p>
              <Button label={'Sign out'} onClick={signOut} />
            </p>
          </>
        ) : (
          <p>
            You are not signed in yet. <ButtonLink href={'/auth/signin'} label={'Sign in!'} />
          </p>
        ))}
    </Page>
  )
}

export default AccountPage
