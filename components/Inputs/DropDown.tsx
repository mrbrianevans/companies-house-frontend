const styles = require('./Inputs.module.scss')
type DropDownProps = {
  options: { label?: string | number; value: string | number }[]
  value: string | number
  valueSetter: (newValue: string | number) => void
}

const DropDown = (props: DropDownProps) => {
  return (
    <select className={styles.dropdown} onChange={(v) => props.valueSetter(v.target.value)} value={props.value}>
      {props.options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label ?? option.value}
        </option>
      ))}
    </select>
  )
}

export default DropDown
