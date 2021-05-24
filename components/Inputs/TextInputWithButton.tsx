import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useState
} from 'react'
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
  buttonOnClick?: ((textValue: string) => void) | ((textValue: string) => Promise<void>)
  buttonLink?: (textValue: string) => string
  initialValue?: string
  textInputType?: 'text' | 'email'
  buttonProps?: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
  buttonLinkProps?: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
  textBoxProps?: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  textBoxOnChange?: (newValue: string) => void
}

export const TextInputWithButton = (props: TextInputWithButtonProps) => {
  const [value, setValue] = useState(props.initialValue ?? '')
  const [buttonText, setButtonText] = useState<string | undefined>(props.buttonText ?? 'Search!')
  const router = useRouter()
  useEffect(() => {
    setButtonText(props.buttonText ?? 'Search!')
  }, [router.asPath])
  const onSubmit = async (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (props.buttonLink && props.buttonLink(value) === decodeURIComponent(router.asPath)) {
      // this stops the <a> tag responding to the click if the URL is the same
      event?.preventDefault()
      return
    }
    setButtonText('Loading...')
    try {
      if (props.buttonOnClick) await props.buttonOnClick(value)
      setButtonText(buttonText)
    } catch (e) {
      console.error(e)
    }

    if (props.buttonLink && !event) await router.push(props.buttonLink(value))
  }
  return (
    <div className={styles.jointContainer}>
      <input
        type={props.textInputType ?? 'text'}
        placeholder={props.textBoxPlaceholder}
        className={styles.jointTextBox}
        id={props.textBoxId}
        value={value}
        style={props.textBoxStyle || {}}
        onChange={(c) => {
          props.textBoxOnChange(c.target.value)
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
        {...props.textBoxProps}
      />
      {props.buttonLink ? (
        <Link href={props.buttonLink(value)} prefetch={false}>
          <a
            className={styles.jointButton}
            style={props.buttonStyle}
            onMouseOver={() => {
              if (props.buttonLink && props.buttonLink(value) !== decodeURIComponent(router.asPath))
                router.prefetch(props.buttonLink(value))
            }}
            {...props.buttonLinkProps}>
            <button
              className={styles.jointButton}
              style={{ fontSize: 'inherit', width: '100%' }}
              onClick={(event) => {
                onSubmit(event)
              }}
              children={buttonText || 'Search!'}
              {...props.buttonProps}
            />
          </a>
        </Link>
      ) : (
        <button
          className={styles.jointButton}
          style={props.buttonStyle}
          onClick={() => {
            onSubmit()
          }}
          children={buttonText || 'Search!'}
          {...props.buttonProps}
        />
      )}
    </div>
  )
}
