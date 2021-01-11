import { CSSProperties, useState } from "react";
import Link from "next/link";

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
  buttonLink?: (textValue: string) => string
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
      {props.buttonLink ?
        <Link href={props.buttonLink(value)}>
          <a className={formStyles.jointButton}>
            {/*{This a tag is shrinking the button for some reason}*/}
            <button className={formStyles.jointButton}
                    style={props.buttonStyle || {}}
                    onClick={() => {
                      props.buttonOnClick && props.buttonOnClick(value);
                    }}>{props.buttonText || "Go!"}</button>
          </a>
        </Link>
        :
        <button className={formStyles.jointButton}
                style={props.buttonStyle || {}}
                onClick={() => {
                  props.buttonOnClick && props.buttonOnClick(value);
                }}>{props.buttonText || "Go!"}</button>
      }

    </div>
  );
};
