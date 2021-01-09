import { CSSProperties, useState } from "react";

const formStyles = require("../styles/form.module.css");

export interface TextInputWithButtonProps {
  textBoxPlaceholder?: string
  textBoxStyle?: CSSProperties
  textBoxId?: string
  // textBoxValue: string
  // textBoxOnChange: (newValue: string)=>void
  buttonStyle?: CSSProperties
  buttonText?: string
  buttonOnClick?: (textValue: string) => void
}

export const TextInputWithButton = (props: TextInputWithButtonProps) => {
  const [value, setValue] = useState("");
  return (
    <div className={formStyles.jointContainer}>
      <input
        type={"text"}
        placeholder={props.textBoxPlaceholder}
        className={formStyles.jointTextBox}
        id={props.textBoxId}
        value={value}
        style={props.textBoxStyle || {}}
        onChange={(c) => {
          setValue(c.target.value);
        }}
      />
      <button className={formStyles.jointButton}
              style={props.buttonStyle || {}}
              onClick={() => {
                props.buttonOnClick && props.buttonOnClick(value);
              }}>{props.buttonText || "Go!"}</button>
    </div>
  );
};
