import { CSSProperties, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const styles = require('./TextInputWithButton.module.sass')

export interface TextInputWithButtonProps {
  textBoxPlaceholder?: string
  textBoxStyle?: CSSProperties
  textBoxId?: string
  // textBoxValue: string
  // textBoxOnChange: (newValue: string)=>void
  buttonStyle?: CSSProperties
  buttonText?: string
  buttonOnClick?: (textValue: string) => void
  buttonLink?: (textValue: string) => string
  initialValue?: string
}

export const TextInputWithButton = (props: TextInputWithButtonProps) => {
  const [value, setValue] = useState(props.initialValue ?? '')
  const [buttonText, setButtonText] = useState<string | undefined>(props.buttonText ?? 'Search!')
  const router = useRouter()
  useEffect(() => {
    setButtonText('Search!')
  }, [router.asPath])
  const onSubmit = async (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (props.buttonLink && props.buttonLink(value) === decodeURIComponent(router.asPath)) {
      // this stops the <a> tag responding to the click if the URL is the same
      event?.preventDefault()
      return
    }
    setButtonText('Loading...')
    if (props.buttonOnClick) props.buttonOnClick(value)
    if (props.buttonLink && !event) await router.push(props.buttonLink(value))
  }
  return (
    <div className={styles.jointContainer}>
      <input
        type={'text'}
        placeholder={props.textBoxPlaceholder}
        className={styles.jointTextBox}
        id={props.textBoxId}
        value={value}
        style={props.textBoxStyle || {}}
        onChange={(c) => {
          setValue(c.target.value)
        }}
        onKeyPress={async (k) => {
          if (k.key === 'Enter') {
            //pressing enter will do the same as clicking the button
            onSubmit()
          }
        }}
        autoComplete={'off'}
        autoCapitalize={'on'}
      />
      {props.buttonLink ? (
        <Link href={props.buttonLink(value)} prefetch={false}>
          <a
            className={styles.jointButton}
            style={props.buttonStyle}
            onMouseOver={() => {
              if (props.buttonLink && props.buttonLink(value) !== decodeURIComponent(router.asPath))
                router.prefetch(props.buttonLink(value))
            }}>
            <button
              className={styles.jointButton}
              style={{ fontSize: 'inherit', width: '100%' }}
              onClick={(event) => {
                onSubmit(event)
              }}>
              {buttonText || 'Search!'}
            </button>
          </a>
        </Link>
      ) : (
        <button
          className={styles.jointButton}
          style={props.buttonStyle}
          onClick={() => {
            onSubmit()
          }}>
          {buttonText || 'Search!'}
        </button>
      )}
    </div>
  )
}
