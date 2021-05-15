import { useRef, useState } from 'react'

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
  const codeRef = useRef<HTMLInputElement>(null)
  const [copied, setCopied] = useState(false)
  const [showExplainer, setShowExplainer] = useState(true)
  const copyClicked = () => {
    codeRef.current?.select()
    codeRef.current.setSelectionRange(0, 99999) /* For mobile devices */
    document.execCommand('copy')
    setCopied(true)
    setTimeout(() => setCopied(false), 3500)
  }
  return (
    <span className={styles.container}>
      {copied && <span className={styles.popup}>Copied to clipboard</span>}
      {!copied && showExplainer && <span className={styles.popup}>Shareable link</span>}
      <pre>
        <a href={'https://' + text}>
          <input ref={codeRef} value={text} className={styles.invisibleInput} readOnly />
        </a>
      </pre>
      <button onClick={copyClicked}>{buttonLabel ?? 'Copy'}</button>
    </span>
  )
}
