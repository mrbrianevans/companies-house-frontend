const styles = require('./Inputs.module.scss')

type IconButtonProps = {
  label: any
  onClick: () => void
  floatRight?: boolean
}
const IconButton = (props: IconButtonProps) => {
  return (
    <button className={styles.iconButton} onClick={props.onClick} style={props.floatRight ? { float: 'right' } : {}}>
      {props.label}
    </button>
  )
}

export default IconButton
