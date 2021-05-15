import { TextInputWithButton, TextInputWithButtonProps } from '../Inputs/TextInputWithButton'
// an extension of TextInputWithButton which styles as a full page search bar
export const GenericSearchBar = (props: TextInputWithButtonProps) => {
  return (
    <TextInputWithButton
      buttonText={'Search!'}
      {...props}
      textBoxStyle={{ width: '80%', height: '3rem', fontSize: '1.25rem' }}
      buttonStyle={{ fontSize: '1.25rem', width: '20%' }}
    />
  )
}
