import * as React from 'react'
import { getYMD } from '../../helpers/splitDate'

const styles = require('./Inputs.module.scss')

type TextBoxDateProps = {
  // timestamp in milliseconds since epoch
  value: number
  // timestamp in milliseconds since epoch
  onChange: (newValue: number) => void
}
const TextBoxDate = (props: TextBoxDateProps) => {
  return (
    <input
      type={'date'}
      className={styles.textBox}
      value={getYMD(props.value)}
      onChange={(v) => props.onChange(new Date(v.target.value).valueOf())}
    />
  )
}

export default TextBoxDate
