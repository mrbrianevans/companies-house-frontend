import * as React from 'react'

const styles = require('./Inputs.module.scss')

type TextBoxProps = {
  placeholder?: string
  value: number
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
    />
  )
}

export default TextBoxNumber
