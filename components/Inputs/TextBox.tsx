import * as React from 'react'
import { useState } from 'react'

const styles = require('./Inputs.module.scss')

type TextBoxProps = {
  placeholder?: string
  value: string
  onChange: (newValue: string) => void
  suggestions?: string[] //todo: give this the option of being [{value: "", label: ""}]
  onEnter?: () => void
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
        onKeyPress={(kv) => {
          if (kv.key == 'Enter') {
            props.onEnter()
          }
        }}
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
