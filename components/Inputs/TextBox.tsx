import * as React from 'react'
import { useState } from 'react'

const styles = require('./Inputs.module.scss')

type TextBoxProps = {
  placeholder?: string
  value: string
  onChange: (newValue: string) => void
  suggestions?: string[] | { label: string; value: string }[]
  onEnter?: () => void
}
const TextBox = (props: TextBoxProps) => {
  const [suggestionObjects] = useState<{ label: string; value: string }[]>(
    props.suggestions?.map((suggestion) => {
      if (typeof suggestion === 'string') return { label: suggestion, value: suggestion }
      else return suggestion
    })
  )
  const [id] = useState(
    'list' +
      suggestionObjects
        ?.map((suggestion) => {
          return `${suggestion.label}${suggestion.value}`
            .split('')
            .map((char) => char.charCodeAt(0))
            .reduce((previousValue, currentValue) => previousValue + currentValue)
        })
        .reduce((previousValue, currentValue) => previousValue + currentValue) *
        props.suggestions?.length
  )

  return (
    <>
      <input
        type={'text'}
        list={suggestionObjects ? id : undefined}
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
      <datalist id={suggestionObjects ? id : undefined}>
        {suggestionObjects?.map((suggestion) => (
          <option key={suggestion.value} value={suggestion.value}>
            {suggestion.label}
          </option>
        ))}
      </datalist>
    </>
  )
}

export default TextBox
