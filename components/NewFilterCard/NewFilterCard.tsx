import * as React from 'react'
import { useState } from 'react'
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
    if (selectedFilterOption.valueType === 'number')
      props.addFilter({
        category: selectedFilterOption.category,
        comparison: 'is between',
        type: 'number',
        min,
        max,
        exclude
      })
    else if (selectedFilterOption.valueType === 'string') {
      // @ts-ignore i'm sorry, i'm checking this manually
      props.addFilter({
        category: selectedFilterOption.category,
        comparison: comparison,
        type: 'string',
        values: [...values, typingValue].filter((v) => v),
        exclude
      })
    }
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
        {/*<select*/}
        {/*  className={formStyles.standard}*/}
        {/*  value={selectedFilterOption.category}*/}
        {/*  onChange={(e) => {*/}
        {/*    const selectedOption = filterOptions.find((option) => option.category === e.target.value)*/}
        {/*    setSelectedFilterOption(selectedOption)*/}
        {/*    setComparison(validateSelectedFilterCriteria(selectedOption, comparison))*/}
        {/*  }}>*/}
        {/*  {filterOptions.map((filterOption) => (*/}
        {/*    <option key={filterOption.category}>{filterOption.category}</option>*/}
        {/*  ))}*/}
        {/*</select>*/}
        <DropDown
          options={filterOptions.map((filterOption) => ({ value: filterOption.category }))}
          value={selectedFilterOption.category}
          valueSetter={(newValue) => {
            const selectedOption = filterOptions.find((option) => option.category === newValue)
            setSelectedFilterOption(selectedOption)
            setComparison(validateSelectedFilterCriteria(selectedOption, comparison))
          }}
        />
        {/*<select*/}
        {/*  className={formStyles.standard}*/}
        {/*  value={comparison}*/}
        {/*  onChange={(v) => {*/}
        {/*    if (*/}
        {/*      'begins with' == v.target.value ||*/}
        {/*      v.target.value === 'includes' ||*/}
        {/*      v.target.value === 'is exactly' ||*/}
        {/*      v.target.value === 'ends with'*/}
        {/*    )*/}
        {/*      setComparison(v.target.value)*/}
        {/*  }}>*/}
        {/*  {*/}
        {/*    // @ts-ignore*/}
        {/*    selectedFilterOption.possibleComparisons.map((criterion: IFilter['comparison']) => (*/}
        {/*      <option key={criterion}>{criterion}</option>*/}
        {/*    ))*/}
        {/*  }*/}
        {/*</select>*/}
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
            <TextBox value={typingValue} onChange={setTypingValue} suggestions={selectedFilterOption.suggestions} />
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

      <Button onClick={addFilter} label={'Add filter'} />
    </div>
  )
}
