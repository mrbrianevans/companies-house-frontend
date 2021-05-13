import { useRef } from 'react'

const styles = require('./ShareCode.module.scss')

type Props = {
  text: string
  buttonLabel?: string
}

/**
 * A shareable link with a copy to clipboard button
 *
 * @param text is the link to share. DO NOT INCLUDE `HTTPS://`
 * @param buttonLabel (optional) the label for the button. default is `Copy`
 */
export const ShareCode = ({ text, buttonLabel }: Props) => {
  const codeRef = useRef<HTMLAnchorElement>(null)
  const copyClicked = () => {
    codeRef.current?.focus()
  }
  return (
    <div className={styles.container}>
      <pre>
        <a ref={codeRef} href={'https://' + text}>
          {text}
        </a>
      </pre>
      <button onClick={copyClicked}>{buttonLabel ?? 'Copy'}</button>
    </div>
  )
}
