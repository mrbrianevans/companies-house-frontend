const styles = require('./Inputs.module.scss')
type DropDownPropsGeneric<ValueType extends number | string> = {
  options: { label?: string | number; value: ValueType }[]
  value: ValueType
  valueSetter: (newValue: ValueType) => void
}

function DropDown<ValueType extends number | string>(props: DropDownPropsGeneric<ValueType>) {
  return (
    <select
      className={styles.dropdown}
      onChange={(v) => props.valueSetter(v.target.value as ValueType)}
      value={props.value}>
      {props.options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label ?? option.value}
        </option>
      ))}
    </select>
  )
}

export default DropDown
