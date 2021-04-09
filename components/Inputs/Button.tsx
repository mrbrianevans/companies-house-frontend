const styles = require('./Inputs.module.scss')

type ButtonProps = {
  label: string
  onClick: () => void
}
const Button = (props: ButtonProps) => {
  return (
    <button className={styles.primary} onClick={props.onClick}>
      {props.label}
    </button>
  )
}

export default Button
