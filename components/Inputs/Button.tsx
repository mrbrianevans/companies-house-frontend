import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

const styles = require('./Inputs.module.scss')

type ButtonProps = {
  label: string
  onClick: () => void
  onHover?: () => void
  buttonProps?: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
}
const Button = (props: ButtonProps) => {
  return (
    <button className={styles.primary} onClick={props.onClick} onMouseOver={props.onHover} {...props.buttonProps}>
      {props.label}
    </button>
  )
}

export default Button
