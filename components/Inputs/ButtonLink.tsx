import Link, { LinkProps } from 'next/link'
import * as React from 'react'
const styles = require('./Inputs.module.scss')

interface ButtonProps extends LinkProps {
  label?: string
}
const Button = (props: ButtonProps) => {
  return (
    <Link href={props.href} {...props}>
      <a className={styles.primary}>{props.label ?? props.href}</a>
    </Link>
  )
}

export default Button
