import { MouseEventHandler } from "react";
import style from "./bond-radio-button.module.scss";

interface IBondRadioButtonProps {
  label: string;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export const BondRadioButton = (props: IBondRadioButtonProps): JSX.Element => {
  return (
    <div
      className={`${style["bondRadioButtonContainer"]} ${
        props.active ? style["active"] : ""
      }`}
      onClick={props.onClick}
    >
      <button
        className={`${style["bondRadioButton-button"]} ${
          props.active ? style["active"] : ""
        }`}
      ></button>
      <span
        className={`${style["bondRadioButton-label"]} ${
          props.active ? style["active"] : ""
        }`}
      >
        {props.label}
      </span>
    </div>
  );
};
