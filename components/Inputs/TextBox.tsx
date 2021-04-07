import * as React from 'react'
import { useState } from 'react'

const styles = require('./Inputs.module.scss')

type TextBoxProps = {
  placeholder?: string
  value: string
  onChange: (newValue: string) => void
  suggestions?: string[]
}
const TextBox = (props: TextBoxProps) => {
  const [id] = useState(
    'list' +
      props.suggestions
        ?.map((suggestion) =>
          suggestion
            .split('')
            .map((char) => char.charCodeAt(0))
            .reduce((previousValue, currentValue) => previousValue + currentValue)
        )
        .reduce((previousValue, currentValue) => previousValue + currentValue) *
        props.suggestions?.length
  )

  return (
    <>
      <input
        list={props.suggestions ? id : undefined}
        className={styles.textBox}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(v) => props.onChange(v.target.value)}
      />
      {props.suggestions && (
        <datalist id={id}>
          {props.suggestions.map((suggestion) => (
            <option key={suggestion}>{suggestion}</option>
          ))}
        </datalist>
      )}
    </>
  )
}

export default TextBox
