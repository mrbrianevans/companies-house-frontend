import { CSSProperties, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

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
  const [buttonText, setButtonText] = useState<string | undefined>(
    props.buttonText
  );
  const router = useRouter();
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
        onKeyPress={async (k) => {
          if (k.key === "Enter") {
            //pressing enter will do the same as clicking the button
            setButtonText("Loading...");
            if (props.buttonOnClick) props.buttonOnClick(value);
            if (props.buttonLink) await router.push(props.buttonLink(value));
          }
        }}
      />
      {props.buttonLink ? (
        <Link href={props.buttonLink(value)}>
          <a className={formStyles.jointButton}>
            {/*{This a tag is shrinking the button for some reason}*/}
            <button
              className={formStyles.jointButton}
              style={props.buttonStyle || {}}
              onClick={() => {
                setButtonText("Loading...");
                props.buttonOnClick && props.buttonOnClick(value);
              }}>
              {buttonText || "Go!"}
            </button>
          </a>
        </Link>
      ) : (
        <button
          className={formStyles.jointButton}
          style={props.buttonStyle || {}}
          onClick={() => {
            setButtonText("Loading...");
            props.buttonOnClick && props.buttonOnClick(value);
          }}>
          {buttonText || "Go!"}
        </button>
      )}
    </div>
  )
}
