const styles = require('./Inputs.module.scss')

type ButtonProps = {
  label: string
  onClick: () => void
  onHover?: () => void
}
const Button = (props: ButtonProps) => {
  return (
    <button className={styles.primary} onClick={props.onClick} onMouseOver={props.onHover}>
      {props.label}
    </button>
  )
}

export default Button
