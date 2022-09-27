import Link, { LinkProps } from 'next/link'
import * as React from 'react'

const styles = require('./Inputs.module.scss')

interface ButtonProps extends LinkProps {
  label?: string
  aProps?: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
  children?: any
}
const ButtonLink = (props: ButtonProps) => {
  return (
    <Link href={props.href} {...props}>
      <a className={styles.primary} {...props.aProps}>
        {props.children ?? props.label ?? props.href}
      </a>
    </Link>
  )
}

export default ButtonLink
