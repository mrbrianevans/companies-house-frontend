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

const styles = require('./NewFilterCard.module.scss')
// const formStyles = require('../styles/form.module.css')
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
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(1000)
  const [exclude, setExclude] = useState(false)
  const [values, setValues] = useState([])
  const [typingValue, setTypingValue] = useState('')
  const [typingNumber, setTypingNumber] = useState<number>(0)
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
      return {
        field: selectedFilterOption.field,
        comparison: comparison,
        values: [...values, typingValue].filter((v) => v.toString().length),
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
    setMin(0)
    setMax(1000)
    setExclude(false)
    setValues([])
    setTypingValue('')
  }
  //todo: when the filter category changes, reset the values to []
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
                {selectedFilterOption.dataType == 'number' && <TextBoxNumber value={min} onChange={(v) => setMin(v)} />}
                {selectedFilterOption.dataType == 'date' && <input type={'date'} />}
                <span className={styles.joiningWordInFormRow}> and </span>
                {selectedFilterOption.dataType == 'number' && <TextBoxNumber value={max} onChange={(v) => setMax(v)} />}
                {selectedFilterOption.dataType == 'date' && <input type={'date'} />}
              </>
            ) : (
              <>
                {selectedFilterOption.dataType == 'string' && (
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
                {selectedFilterOption.dataType == 'number' && (
                  <TextBoxNumber
                    value={typingNumber}
                    onChange={setTypingNumber}
                    onEnter={() => {
                      addValue(typingValue.trim())
                      setTypingValue('')
                    }}
                  />
                )}
                {selectedFilterOption.dataType == 'date' && <input type={'date'} />}
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
            {exclude ? 'Exclude' : 'Only show'} {props.filteringLabel} where {selectedFilterOption.field}{' '}
            {getFilterComparisonProperties(comparison).english}{' '}
            {comparison === FilterComparison.IS_BETWEEN
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
        </>
      )}
    </div>
  )
}
