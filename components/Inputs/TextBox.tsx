import * as React from 'react'
import { useEffect, useState } from 'react'

const styles = require('./Inputs.module.scss')

type TextBoxProps = {
  placeholder?: string
  value: string
  onChange: (newValue: string) => void
  suggestions?: string[] | { label: string; value: string }[]
  onEnter?: () => void
}
const TextBox = (props: TextBoxProps) => {
  return (
    <>
      <input
        type={'text'}
        list={getSuggestionsHash(props.suggestions)}
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
      <datalist id={getSuggestionsHash(props.suggestions)}>
        {getUnifiedSuggestions(props.suggestions)?.map((suggestion) => (
          <option key={suggestion.value} value={suggestion.value} label={suggestion.label}>
            {suggestion.label}
          </option>
        ))}
      </datalist>
    </>
  )
}

export default TextBox

const getUnifiedSuggestions = (suggestions: string[] | SuggestionObject[]) => {
  return suggestions?.map((suggestion) => {
    if (typeof suggestion === 'string') return { label: suggestion, value: suggestion }
    else return suggestion
  })
}

const getSuggestionsHash = (suggestions?: string[] | SuggestionObject[]) => {
  return suggestions
    ? 'list' +
        getUnifiedSuggestions(suggestions)
          ?.map((suggestion) => {
            return `${suggestion.label}${suggestion.value}`
              .split('')
              .map((char) => char.charCodeAt(0))
              .reduce((previousValue, currentValue) => previousValue + currentValue)
          })
          .reduce((previousValue, currentValue) => previousValue + currentValue) *
          suggestions.length
    : undefined
}

type SuggestionObject = { label: string; value: string }
