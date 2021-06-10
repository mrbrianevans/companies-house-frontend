import * as React from 'react'
import { useEffect, useState } from 'react'
import { IFilter, IFilterOption } from '../../types/IFilters'
import DropDown from '../Inputs/DropDown'
import FormRow from '../Inputs/FormRow'
import Button from '../Inputs/Button'
import IconButton from '../Inputs/IconButton'
import TextBox from '../Inputs/TextBox'
import TextBoxNumber from '../Inputs/TextBoxNumber'

const styles = require('./NewFilterCard.module.scss')
// const formStyles = require('../styles/form.module.css')
type Props = {
  addFilter: (filter: IFilter) => void
  filteringLabel: string
  filterOptions: IFilterOption[]
  onChange?: (filter: IFilter) => void
  // only calls once per filter change
  onHoverAdd?: ((filter: IFilter) => void) | ((filter: IFilter) => Promise<void>)
}

export function NewFilterCard(props: Props) {
  const filterOptions: IFilterOption[] = props.filterOptions
  const [selectedFilterOption, setSelectedFilterOption] = useState<IFilterOption>(filterOptions[0])
  const [comparison, setComparison] = useState<IFilter['comparison']>(selectedFilterOption.possibleComparisons[0])
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(1000)
  const [exclude, setExclude] = useState(false)
  const [values, setValues] = useState([])
  const [typingValue, setTypingValue] = useState('')
  const [hasCalledOnHover, setHasCalledOnHover] = useState(false)
  // @ts-ignore this is very bad type design
  const getCurrentFilter: () => IFilter = () => {
    if (selectedFilterOption.valueType === 'number')
      return {
        category: selectedFilterOption.category,
        comparison: 'is between',
        type: 'number',
        min,
        max,
        exclude
      }
    else if (selectedFilterOption.valueType === 'string') {
      // @ts-ignore i'm sorry, i'm checking this manually
      return {
        category: selectedFilterOption.category,
        comparison: comparison,
        type: 'string',
        values: [...values, typingValue].filter((v) => v),
        exclude
      }
    }
  }
  // listen for changes to the filter and call onChange()
  useEffect(() => {
    setHasCalledOnHover(false)
    if (props.onChange !== undefined) props.onChange(getCurrentFilter())
  }, [min, max, exclude, values, typingValue, selectedFilterOption, comparison])
  const validateSelectedFilterCriteria = (
    selectedFilterOption: IFilterOption,
    selectedFilterCriteria: IFilter['comparison']
  ) => {
    if (
      // @ts-ignore i'm not so great with this kind of typescript
      selectedFilterOption.possibleComparisons.includes(selectedFilterCriteria)
    )
      return selectedFilterCriteria
    else return selectedFilterOption.possibleComparisons[0]
  }
  const addValue = (value: string) => {
    if (value.length) setValues((prevState) => [...prevState, value])
  }
  const addFilter = () => {
    props.addFilter(getCurrentFilter())
    // sets the inputs to their default values.
    setSelectedFilterOption(filterOptions[0])
    setComparison(selectedFilterOption.possibleComparisons[0])
    setMin(0)
    setMax(1000)
    setExclude(false)
    setValues([])
    setTypingValue('')
  }
  //todo: when the filter category changes, reset the values to []
  return (
    <div className={styles.newFilterCard} style={{ width: '100%' }}>
      <h3>Add new filter</h3>
      <FormRow>
        {/*<label>*/}
        {/*  Exclude?{" "}*/}
        {/*  <input*/}
        {/*    type={"checkbox"}*/}
        {/*    checked={exclude}*/}
        {/*    onChange={(v) => setExclude(v.target.checked)}*/}
        {/*  />*/}
        {/*</label>*/}
        <DropDown
          options={filterOptions.map((filterOption) => ({ value: filterOption.category }))}
          value={selectedFilterOption.category}
          valueSetter={(newValue) => {
            const selectedOption = filterOptions.find((option) => option.category === newValue)
            setSelectedFilterOption(selectedOption)
            setComparison(validateSelectedFilterCriteria(selectedOption, comparison))
          }}
        />
        <DropDown
          // @ts-ignore
          options={selectedFilterOption.possibleComparisons.map((value: any) => ({ value }))}
          value={comparison}
          valueSetter={(v) => {
            if (v === 'begins with' || v === 'includes' || v === 'is exactly' || v === 'ends with') setComparison(v)
          }}
        />
        {selectedFilterOption.valueType === 'number' ? (
          <>
            <TextBoxNumber value={min} onChange={(v) => setMin(v)} />
            <span className={styles.joiningWordInFormRow}> and </span>
            <TextBoxNumber value={max} onChange={(v) => setMax(v)} />
          </>
        ) : (
          <>
            <TextBox
              value={typingValue}
              onChange={setTypingValue}
              suggestions={selectedFilterOption.suggestions}
              onEnter={() => {
                addValue(typingValue.trim())
                setTypingValue('')
              }}
            />
            <IconButton
              label={'+'}
              onClick={() => {
                addValue(typingValue.trim())
                setTypingValue('')
              }}
            />
          </>
        )}
      </FormRow>
      <p>
        {exclude ? 'Exclude' : 'Only show'} {props.filteringLabel} where {selectedFilterOption.category} {comparison}{' '}
        {selectedFilterOption.valueType === 'number'
          ? min + ' and ' + max
          : values.length
          ? values.join(' or ')
          : typingValue}
      </p>

      <Button
        onClick={addFilter}
        label={'Add filter'}
        onHover={() => {
          if (!hasCalledOnHover) {
            if (props.onHoverAdd !== undefined) props.onHoverAdd(getCurrentFilter())
            setHasCalledOnHover(true)
          }
        }}
      />
    </div>
  )
}
