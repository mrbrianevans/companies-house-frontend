import * as React from 'react'
import { useEffect, useState } from 'react'
import { IFilterOption, IFilterValue } from '../../types/IFilters'
import DropDown from '../Inputs/DropDown'
import FormRow from '../Inputs/FormRow'
import Button from '../Inputs/Button'
import IconButton from '../Inputs/IconButton'
import TextBox from '../Inputs/TextBox'
import TextBoxNumber from '../Inputs/TextBoxNumber'
import { FilterComparison, FilterComparisonsMap } from '../../configuration/filterComparisons'
import { getFilterComparisonProperties } from '../../helpers/filters/getFilterComparisonProperties'
import TextBoxDate from '../Inputs/TextBoxDate'
import { translateFilterToEnglish } from '../../helpers/filters/translateFiltersToEnglish'
import { FilterDatatype } from '../../configuration/filterDatatypes'

const styles = require('./NewFilterCard.module.scss')
type Props = {
  addFilter: (filter: IFilterValue) => void
  filteringLabel: string
  filterOptions: IFilterOption[]
  onChange?: (filter: IFilterValue) => void
  // only calls once per filter change
  onHoverAdd?: ((filter: IFilterValue) => void) | ((filter: IFilterValue) => Promise<void>)
}

export function NewFilterCard(props: Props) {
  const filterOptions: IFilterOption[] = props.filterOptions
  const [selectedFilterOption, setSelectedFilterOption] = useState<IFilterOption>(
    filterOptions.length && filterOptions[0]
  )
  const [comparison, setComparison] = useState<FilterComparison>(
    filterOptions.length && selectedFilterOption.possibleComparisons[0]
  )
  // min and typingNumber COULD technically be the same variable (reuse), but might be less readable
  // Rather than having separate state for the Date, number and Date share state variables
  const [min, setMin] = useState(NaN)
  const [max, setMax] = useState(NaN)
  const [typingNumber, setTypingNumber] = useState<number>(NaN)
  const [values, setValues] = useState([])
  const [typingValue, setTypingValue] = useState('')
  const [exclude, setExclude] = useState(false)
  const [hasCalledOnHover, setHasCalledOnHover] = useState(false)
  const getCurrentFilter: () => IFilterValue = () => {
    if (comparison === FilterComparison.IS_BETWEEN)
      return {
        field: selectedFilterOption.field,
        comparison: FilterComparison.IS_BETWEEN,
        values: [min, max],
        exclude
      }
    else {
      let _values: string[] | [number, number] | [number]
      switch (selectedFilterOption.dataType) {
        case FilterDatatype.date:
        case FilterDatatype.number:
          _values = [typingNumber]
          break
        case FilterDatatype.string:
          _values = [...values, typingValue].filter((v) => v.toString().length)
          break
      }
      return {
        field: selectedFilterOption.field,
        comparison: comparison,
        values: _values,
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
    selectedFilterCriteria: IFilterValue['comparison']
  ) => {
    if (selectedFilterOption.possibleComparisons.includes(selectedFilterCriteria)) return Number(selectedFilterCriteria)
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
    setMin(NaN)
    setMax(NaN)
    setExclude(false)
    setValues([])
    setTypingValue('')
    setTypingNumber(NaN)
  }
  //when the filter category changes, reset the values to []
  useEffect(() => {
    setComparison(selectedFilterOption.possibleComparisons[0])
    setMin(NaN)
    setMax(NaN)
    setExclude(false)
    setValues([])
    setTypingValue('')
    setTypingNumber(NaN)
  }, [selectedFilterOption])
  return (
    <div className={styles.newFilterCard} style={{ width: '100%' }} data-test-id={'newFilterDiv'}>
      <h3>Add new filter</h3>
      {filterOptions.length && (
        <>
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
              options={filterOptions.map((filterOption) => ({ value: filterOption.field }))}
              value={selectedFilterOption.field}
              valueSetter={(newValue) => {
                const selectedOption = filterOptions.find((option) => option.field === newValue)
                setSelectedFilterOption(selectedOption)
                setComparison(validateSelectedFilterCriteria(selectedOption, comparison))
              }}
            />
            <DropDown
              options={selectedFilterOption.possibleComparisons.map((value: any) => ({
                value,
                label: getFilterComparisonProperties(value).english
              }))}
              value={comparison}
              valueSetter={(v) => {
                setComparison(Number(v))
              }}
            />
            {comparison === FilterComparison.IS_BETWEEN ? (
              <>
                {selectedFilterOption.dataType == FilterDatatype.number && (
                  <TextBoxNumber value={min} onChange={setMin} />
                )}
                {selectedFilterOption.dataType == FilterDatatype.date && <TextBoxDate value={min} onChange={setMin} />}
                <span className={styles.joiningWordInFormRow}> and </span>
                {selectedFilterOption.dataType == FilterDatatype.number && (
                  <TextBoxNumber value={max} onChange={setMax} />
                )}
                {selectedFilterOption.dataType == FilterDatatype.date && <TextBoxDate value={max} onChange={setMax} />}
              </>
            ) : (
              <>
                {selectedFilterOption.dataType == FilterDatatype.string && (
                  <TextBox
                    value={typingValue}
                    onChange={setTypingValue}
                    suggestions={selectedFilterOption.suggestions}
                    onEnter={() => {
                      addValue(typingValue.trim())
                      setTypingValue('')
                    }}
                  />
                )}
                {selectedFilterOption.dataType == FilterDatatype.number && (
                  <TextBoxNumber
                    value={typingNumber}
                    onChange={setTypingNumber}
                    onEnter={() => {
                      addValue(typingValue.trim())
                      setTypingValue('')
                    }}
                  />
                )}
                {selectedFilterOption.dataType == FilterDatatype.date && (
                  <TextBoxDate value={typingNumber} onChange={setTypingNumber} />
                )}
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
          <p>{translateFilterToEnglish(getCurrentFilter(), selectedFilterOption, props.filteringLabel)}</p>

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
        </>
      )}
    </div>
  )
}
