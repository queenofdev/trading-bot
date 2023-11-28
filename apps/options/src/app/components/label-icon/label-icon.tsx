import { SvgIcon } from "@mui/material";

interface LabelIconProps {
  label: string;
  icon: React.ElementType;
  reverse?: boolean;
  labelFontSize?: number;
  iconFontSize?: number;
  labelColor?: string;
  iconColor?: string;
  backgroundColor?: string;
  px?: number;
  py?: number;
  rounded?: string;
  gap?: number;
  className?: string;
}

export const LabelIcon = (props: LabelIconProps) => {
  const { label, icon, reverse, gap, className } = props;
  const spacing = reverse
    ? gap
      ? "order-last ml-" + gap
      : "order-last ml-5"
    : gap
    ? "mr-" + gap
    : "mr-5";
  return (
    <div
      className={`${className} flex items-center bg-${
        props.backgroundColor ? props.backgroundColor : "heavybunker"
      } 
      px-${props.px ? props.px : "0"} py-${props.py ? props.py : "0"} 
      rounded-${props.rounded ? props.rounded : "none"}`}
    >
      <div
        className={`text-${props.labelColor ? props.labelColor : "primary"} text-${
          props.labelFontSize ? props.labelFontSize : 16
        } ${spacing}`}
      >
        {label}
      </div>
      <div
        className={`text-${props.iconColor ? props.iconColor : "primary"} text-${
          props.iconFontSize ? props.iconFontSize : 16
        }`}
      >
        <SvgIcon component={icon} sx={{ fontSize: props.iconFontSize }} />
      </div>
    </div>
  );
};
