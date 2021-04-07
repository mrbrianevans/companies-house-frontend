const styles = require('./Inputs.module.scss')

type TextAreaProps = {
  placeholder?: string
  value: string
  onChange: (newValue: string) => void
}
const TextArea = (props: TextAreaProps) => {
  return (
    <textarea
      className={styles.textArea}
      placeholder={props.placeholder}
      value={props.value}
      onChange={(v) => props.onChange(v.target.value)}
    />
  )
}

export default TextArea
