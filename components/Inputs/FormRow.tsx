const styles = require('./Inputs.module.scss')

type FormRowProps = {
  children: any
}
const FormRow = (props: FormRowProps) => {
  return <div className={styles.formRow}>{props.children}</div>
}

export default FormRow
