import * as React from 'react'

const styles = require('./Inputs.module.scss')

type TextBoxProps = {
  placeholder?: string
  value: number
  onEnter?: () => void
  onChange: (newValue: number) => void
}
const TextBoxNumber = (props: TextBoxProps) => {
  return (
    <input
      type={'number'}
      className={styles.textBox}
      placeholder={props.placeholder}
      value={props.value}
      onChange={(v) => props.onChange(Number(v.target.value))}
      onKeyPress={(kv) => {
        if (kv.key == 'Enter') {
          props.onEnter()
        }
      }}
    />
  )
}

export default TextBoxNumber
